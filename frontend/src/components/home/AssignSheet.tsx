import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import type { Role } from '@rota/contract';
import { Avatar, Button, SelectField, TextField, type SelectOption } from '@/components';
import { StepIndicator } from '@/components/auth/StepIndicator';
import { errorMessage } from '@/components/ErrorState';
import { useCreateInvite, useCreateShift, useMembers } from '@/api/queries';
import { t as translate } from '@/i18n';
import { ROLE_KEYS, dayKey, isDayInput, isTimeHHMM, isScheduler, localIsoFromDayAndTime } from '@/lib/rota';
import { useSessionStore } from '@/stores/session';
import { useTheme } from '@/theme';
import { font, shadow } from '@/theme/tokens';
import { inviteWaitState } from './inviteStatus';

type InviteRole = 'admin' | 'manager' | 'member';
type OpenField = 'assignee' | 'role' | 'inviteRole' | null;
type FieldErrors = { userId?: string; day?: string; time?: string; end?: string; invite?: string };

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const URL_RE = /^https?:\/\/[^\s]+$/i;
const LOCATION_PRESETS = ['Zoom', 'On-site', 'Remote'];
const INVITE_ROLES: InviteRole[] = ['admin', 'manager', 'member'];
const ROLE_PRESETS = Object.keys(ROLE_KEYS) as Role[];

const STEPS = [
  { title: 'Who is this for?', hint: 'Pick the teammate who will work this shift.' },
  { title: 'When is it?', hint: 'Set the date and working hours.' },
  { title: 'What are they doing?', hint: 'Add a role and where they will be.' },
  { title: 'Anything else?', hint: 'Notes help your teammate prepare.' },
  { title: 'Review & assign', hint: 'Check the details before you assign.' },
] as const;

export function AssignSheet({ date, onClose }: { date: Date; onClose: () => void }) {
  const t = useTheme();
  const { height } = useWindowDimensions();
  const { top, bottom } = useSafeAreaInsets();
  const members = useMembers();
  const team = useSessionStore((state) => state.team);
  const createShift = useCreateShift();
  const invite = useCreateInvite();
  const canSchedule = isScheduler(team?.role);

  const [step, setStep] = useState(0);
  const [openField, setOpenField] = useState<OpenField>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState('');
  const [customRole, setCustomRole] = useState('');
  const [addingRole, setAddingRole] = useState(false);

  const [addingMember, setAddingMember] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<InviteRole>('member');
  const [pendingInvites, setPendingInvites] = useState<string[]>([]);
  const refetchedOnOpen = useRef(false);

  const [day, setDay] = useState(() => dayKey(date));
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [location, setLocation] = useState('');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [linkError, setLinkError] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const stepCount = STEPS.length;
  const current = STEPS[step] ?? STEPS[0];
  const isLast = step === stepCount - 1;

  const selectedMember = (members.data ?? []).find((member) => member.id === userId);
  const memberCount = members.data?.length ?? 0;
  const wait = inviteWaitState(pendingInvites, memberCount);

  useEffect(() => {
    if (refetchedOnOpen.current) return;
    refetchedOnOpen.current = true;
    void members.refetch();
  }, [members.refetch]);

  const memberOptions: SelectOption<string>[] = (members.data ?? []).map((member) => ({
    value: member.id,
    label: member.name,
    description: translate(ROLE_KEYS[member.role]),
    leading: <Avatar name={member.name} size="sm" />,
  }));

  const roleOptions: SelectOption<string>[] = [
    ...ROLE_PRESETS.map((preset) => ({ value: preset as string, label: translate(ROLE_KEYS[preset]) })),
    ...(customRole ? [{ value: customRole, label: customRole }] : []),
  ];

  const inviteRoleOptions: SelectOption<InviteRole>[] = INVITE_ROLES.map((preset) => ({
    value: preset,
    label: translate(ROLE_KEYS[preset]),
  }));

  const validateStep = (index: number): FieldErrors => {
    const next: FieldErrors = {};
    if (index === 0 && !userId) next.userId = 'Pick a member.';
    if (index === 1) {
      if (!isDayInput(day)) next.day = 'Use YYYY-MM-DD.';
      if (!isTimeHHMM(startTime) || !isTimeHHMM(endTime)) {
        next.time = 'Use HH:MM.';
      } else {
        const startsAt = localIsoFromDayAndTime(day, startTime);
        const endsAt = localIsoFromDayAndTime(day, endTime);
        if (startsAt && endsAt && new Date(endsAt).getTime() <= new Date(startsAt).getTime()) {
          next.end = 'End time must be after the start.';
        }
      }
    }
    return next;
  };

  const goTo = (index: number) => {
    setOpenField(null);
    setStep(index);
  };

  const next = () => {
    const errs = validateStep(step);
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStep((s) => Math.min(s + 1, stepCount - 1));
  };

  const back = () => goTo(Math.max(step - 1, 0));

  const sendInvite = () => {
    if (!EMAIL_RE.test(inviteEmail.trim())) {
      setErrors((prev) => ({ ...prev, invite: 'Enter a valid email address.' }));
      return;
    }
    invite.mutate(
      { email: inviteEmail.trim(), role: inviteRole },
      {
        onSuccess: () => {
          const email = inviteEmail.trim();
          setPendingInvites((prev) => (prev.includes(email) ? prev : [...prev, email]));
          setInviteEmail('');
          setAddingMember(false);
          setErrors((prev) => ({ ...prev, invite: undefined }));
        },
      },
    );
  };

  const submit = () => {
    const errs: FieldErrors = { ...validateStep(0), ...validateStep(1) };
    setErrors(errs);
    if (!userId) {
      goTo(0);
      return;
    }
    if (errs.day || errs.time || errs.end) {
      goTo(1);
      return;
    }

    const startsAt = localIsoFromDayAndTime(day, startTime);
    const endsAt = localIsoFromDayAndTime(day, endTime);
    if (!startsAt || !endsAt) {
      setErrors({ time: 'Use HH:MM.' });
      goTo(1);
      return;
    }

    const link = meetingUrl.trim();
    if (link && !URL_RE.test(link)) {
      setLinkError('Enter a valid link.');
      goTo(2);
      return;
    }

    createShift.mutate(
      {
        userId,
        startsAt,
        endsAt,
        role: role.trim() || undefined,
        location: location.trim() || undefined,
        meetingUrl: link || undefined,
        notes: notes.trim() || undefined,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <View style={{ backgroundColor: t.card, borderTopLeftRadius: 28, borderTopRightRadius: 28,
      padding: 20, paddingBottom: 20, maxHeight: height - top - Math.max(bottom, 12) - 16, ...shadow(10, 30, 'rgba(47,36,32,0.18)') }} testID="assign-sheet">
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: t.hairline }} />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ fontFamily: font.black, fontSize: 20, lineHeight: 26, color: t.ink }}>Assign shift</Text>
          <Text style={{ fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: t.muted }}>
            {`Step ${step + 1} of ${stepCount}`}
          </Text>
        </View>
        <Pressable onPress={onClose} accessibilityLabel="Close" testID="assign-close"
          style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.chip, alignItems: 'center', justifyContent: 'center' }}>
          <Feather name="x" size={20} color={t.ink} />
        </Pressable>
      </View>

      <View style={{ marginTop: 12, marginBottom: 4 }}>
        <StepIndicator
          count={stepCount}
          activeIndex={step}
          accessibilityLabel={`Step ${step + 1} of ${stepCount}: ${current.title}`}
          testID="assign-step-indicator"
        />
      </View>

      <View style={{ marginTop: 16, marginBottom: 12, gap: 4 }}>
        <Text style={{ fontFamily: font.black, fontSize: 17, lineHeight: 22, color: t.ink }} testID="assign-step-title">
          {current.title}
        </Text>
        <Text style={{ fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: t.muted }}>{current.hint}</Text>
      </View>

      <ScrollView keyboardShouldPersistTaps="handled" style={{ flexShrink: 1 }}
        contentContainerStyle={{ gap: 16 }}>
        {!canSchedule ? (
          <View style={{ backgroundColor: t.primaryTint, borderRadius: 14, padding: 12 }}>
            <Text style={{ fontFamily: font.semi, fontSize: 13, lineHeight: 18, color: t.primaryText }}>
              Only owners, admins and managers can assign shifts.
            </Text>
          </View>
        ) : null}

        {createShift.error ? (
          <Text style={{ fontFamily: font.semi, fontSize: 13, lineHeight: 18, color: t.danger }}>
            {errorMessage(createShift.error)}
          </Text>
        ) : null}

        {step === 0 ? (
          <View style={{ gap: 12 }}>
            <SelectField
              label="Assign to"
              placeholder={memberOptions.length ? 'Choose a team member' : 'No team members yet'}
              value={userId}
              options={memberOptions}
              onChange={setUserId}
              open={openField === 'assignee'}
              onOpenChange={(open) => setOpenField(open ? 'assignee' : null)}
              searchable
              error={errors.userId}
              disabled={!canSchedule}
              actionLabel="Add team member"
              onAction={() => {
                setOpenField(null);
                setAddingMember(true);
              }}
              testID="assign-to"
            />

            {addingMember ? (
              <View style={{ gap: 12, backgroundColor: t.bg, borderRadius: 16, padding: 14,
                borderWidth: 1, borderColor: t.hairline }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontFamily: font.bold, fontSize: 14, color: t.ink }}>Invite a team member</Text>
                  <Pressable onPress={() => setAddingMember(false)} accessibilityLabel="Close invite form"
                    style={{ width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name="x" size={16} color={t.muted} />
                  </Pressable>
                </View>
                <TextField label="Email" value={inviteEmail} onChangeText={setInviteEmail}
                  keyboardType="email-address" autoCapitalize="none" autoComplete="email"
                  error={errors.invite} testID="invite-email" />
                <SelectField label="Their role" value={inviteRole} options={inviteRoleOptions}
                  onChange={(value) => setInviteRole(value)}
                  open={openField === 'inviteRole'}
                  onOpenChange={(open) => setOpenField(open ? 'inviteRole' : null)}
                  testID="invite-role" />
                {invite.error ? (
                  <Text style={{ fontFamily: font.semi, fontSize: 13, lineHeight: 18, color: t.danger }}>
                    {errorMessage(invite.error)}
                  </Text>
                ) : null}
                <Button label="Send invite" loading={invite.isPending} onPress={sendInvite} testID="invite-send" />
              </View>
            ) : null}

            {wait.title ? (
              <View style={{ gap: 10, backgroundColor: pendingInvites.length ? t.greenTint : t.bg,
                borderRadius: 16, padding: 14, borderWidth: 1, borderColor: t.hairline }}
                testID="assign-invite-state">
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Feather name={pendingInvites.length ? 'check-circle' : 'user-plus'} size={16}
                    color={pendingInvites.length ? t.green : t.muted} />
                  <Text style={{ flex: 1, fontFamily: font.semi, fontSize: 13, color: t.ink }}>
                    {wait.title}
                  </Text>
                </View>
                <Text style={{ fontFamily: font.regular, fontSize: 13, lineHeight: 18, color: t.muted }}>
                  {wait.body}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Button label="Invite someone else" variant="ghost" onPress={() => setAddingMember(true)}
                    style={{ flex: 1 }} testID="invite-another" />
                  <Button label="Close" variant="ghost" onPress={onClose} style={{ flex: 1 }} testID="invite-done" />
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {step === 1 ? (
          <View style={{ gap: 12 }}>
            <TextField label="Date" value={day} onChangeText={setDay} error={errors.day} editable={canSchedule}
              keyboardType="numbers-and-punctuation" autoCapitalize="none" maxLength={10} testID="assign-day" />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <TextField label="Start" value={startTime} onChangeText={setStartTime} error={errors.time} editable={canSchedule}
                  keyboardType="numbers-and-punctuation" maxLength={5} testID="assign-start" />
              </View>
              <View style={{ flex: 1 }}>
                <TextField label="End" value={endTime} onChangeText={setEndTime} error={errors.end} editable={canSchedule}
                  keyboardType="numbers-and-punctuation" maxLength={5} testID="assign-end" />
              </View>
            </View>
          </View>
        ) : null}

        {step === 2 ? (
          <View style={{ gap: 12 }}>
            <SelectField
              label="Role"
              placeholder="Choose or add a role"
              value={role || null}
              options={roleOptions}
              onChange={(value) => setRole(value)}
              open={openField === 'role'}
              onOpenChange={(open) => setOpenField(open ? 'role' : null)}
              disabled={!canSchedule}
              actionLabel="Add custom role"
              onAction={() => {
                setOpenField(null);
                setAddingRole(true);
              }}
              testID="assign-role"
            />
            {addingRole ? (
              <TextField label="Custom role" value={customRole}
                onChangeText={(value) => {
                  setCustomRole(value);
                  setRole(value);
                }}
                autoCapitalize="words" testID="assign-custom-role" />
            ) : null}
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {LOCATION_PRESETS.map((preset) => {
                const active = location === preset;
                return (
                  <Pressable
                    key={preset}
                    onPress={() => setLocation(preset)}
                    accessibilityLabel={preset}
                    testID={`assign-location-${preset.toLowerCase()}`}
                    style={{ height: 36, paddingHorizontal: 14, borderRadius: 18, justifyContent: 'center',
                      backgroundColor: active ? t.primary : t.chip }}
                  >
                    <Text style={{ fontFamily: font.semi, fontSize: 13, color: active ? '#FFFFFF' : t.ink }}>
                      {preset}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <TextField label="Location" value={location} onChangeText={setLocation} editable={canSchedule}
              maxLength={60} testID="assign-location" />
            <TextField
              label="Meeting link (optional)"
              value={meetingUrl}
              onChangeText={(value) => {
                setMeetingUrl(value);
                if (linkError) setLinkError(undefined);
              }}
              onBlur={() => {
                const value = meetingUrl.trim();
                setLinkError(value && !URL_RE.test(value) ? 'Enter a valid link.' : undefined);
              }}
              editable={canSchedule}
              keyboardType="url"
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Paste a Zoom, Meet or Teams link"
              maxLength={500}
              error={linkError}
              testID="assign-meeting-url"
            />
          </View>
        ) : null}

        {step === 3 ? (
          <TextField label="Notes" value={notes} onChangeText={setNotes} editable={canSchedule}
            maxLength={280} multiline testID="assign-notes" />
        ) : null}

        {step === 4 ? (
          <View style={{ gap: 10, backgroundColor: t.bg, borderRadius: 16, padding: 16,
            borderWidth: 1, borderColor: t.hairline }}>
            <SummaryRow icon="user" label="Assigned to" value={selectedMember?.name ?? '—'} />
            <SummaryRow icon="calendar" label="Date" value={day} />
            <SummaryRow icon="clock" label="Time" value={`${startTime} – ${endTime}`} />
            <SummaryRow icon="briefcase" label="Role" value={role.trim() || '—'} />
            <SummaryRow icon="map-pin" label="Location" value={location.trim() || '—'} />
            <SummaryRow icon="video" label="Meeting link" value={meetingUrl.trim() || '—'} />
            <SummaryRow icon="file-text" label="Notes" value={notes.trim() || '—'} />
          </View>
        ) : null}
      </ScrollView>

      {!isLast && (wait.hint || (step === 0 && errors.userId)) ? (
        <Text
          style={{ fontFamily: font.regular, fontSize: 12, color: step === 0 && errors.userId ? t.danger : t.muted }}
          testID="assign-next-hint"
        >
          {step === 0 && errors.userId ? errors.userId : wait.hint}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
        {step > 0 ? (
          <Button label="Back" variant="ghost" onPress={back} style={{ flex: 1 }} testID="assign-back" />
        ) : null}
        {isLast ? (
          <Button label="Assign shift" style={{ flex: 1 }} loading={createShift.isPending}
            disabled={!canSchedule} onPress={submit} testID="assign-submit" />
        ) : (
          <Button label="Next" style={{ flex: 1 }} disabled={!canSchedule || !wait.canContinue}
            onPress={next} testID="assign-next" />
        )}
      </View>
    </View>
  );
}

function SummaryRow({ icon, label, value }:
  { icon: 'user' | 'calendar' | 'clock' | 'briefcase' | 'map-pin' | 'video' | 'file-text'; label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <Feather name={icon} size={16} color={t.muted} />
      <Text style={{ flex: 1, fontFamily: font.regular, fontSize: 13, color: t.muted }}>{label}</Text>
      <Text numberOfLines={1} style={{ flexShrink: 1, fontFamily: font.bold, fontSize: 13, color: t.ink }}>{value}</Text>
    </View>
  );
}
