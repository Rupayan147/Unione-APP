import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BulletList, InfoScreen, InfoSection } from '@/components/InfoScreen';
import { SecurityArchitectureCard, VerticalPipeline } from '@/components/InstitutionalCards';
import { styles as ui } from '@/components/Ui';
import { useColors } from '@/hooks/useColors';

const plannedControls = [
  ['filter-outline', 'Data minimization', 'Collect only information required to evaluate or prepare a benefit application.'],
  ['lock-closed-outline', 'Encryption in transit', 'Use HTTPS/TLS between the mobile app and production services.'],
  ['server-outline', 'Encryption at rest', 'Protect production databases, files, and backups with managed encryption.'],
  ['finger-print-outline', 'Authentication', 'Secure identity, authentication, and session-management controls.'],
  ['people-outline', 'Role-based access control', 'Separate permissions for users, authorized support staff, and institutional administrators.'],
  ['layers-outline', 'Sensitive-data separation', 'Separate personally identifiable information from analytics wherever practical.'],
  ['reader-outline', 'Audit logs', 'Record data changes, mapping changes, user approvals, submission authorization, and system actions.'],
  ['checkmark-done-outline', 'Consent management', 'Give users explicit control over sensitive-data uses.'],
  ['trash-outline', 'Retention and deletion', 'Define retention rules and support user-controlled deletion requests.'],
  ['key-outline', 'Secrets management', 'Keep API keys and service credentials out of the mobile client.'],
  ['pulse-outline', 'Monitoring and anomaly detection', 'Monitor production services for unusual access and operational events.'],
  ['cloud-done-outline', 'Backup and recovery', 'Use tested backup, restoration, and continuity procedures.'],
  ['shield-outline', 'Least privilege', 'Limit people and services to the minimum access needed for their role.'],
  ['alert-circle-outline', 'Incident response', 'Maintain a documented process to detect, contain, communicate, and recover from incidents.'],
] as const;

export default function TrustSecurityScreen() {
  const colors = useColors();
  return (
    <InfoScreen
      eyebrow="TRUST & SECURITY"
      title="Security starts with clarity."
      subtitle="This page separates what this demo does today from capabilities that would be required in a production deployment."
      badge="PROTOTYPE ARCHITECTURE"
    >
      <View style={[styles.controlCard, { backgroundColor: colors.primary }]}>
        <Ionicons name="shield-checkmark-outline" size={24} color={colors.primaryForeground} />
        <View style={styles.flexibleContent}>
          <Text style={[ui.h3, { color: colors.primaryForeground }]}>You control the final action</Text>
          <Text style={[ui.small, { color: colors.primaryForeground, opacity: 0.86, marginTop: 4, lineHeight: 18 }]}>UNIONE is designed to prepare and explain information—not silently submit it.</Text>
        </View>
      </View>

      <InfoSection title="Current prototype" detail="Implemented or intentionally limited in this APK.">
        <BulletList items={[
          'Demo and local benefit data',
          'Local user and attestation state where applicable',
          'No live government form submission',
          'No production identity verification',
          'No claim of government certification or agency integration',
        ]} />
      </InfoSection>

      <InfoSection title="Planned production architecture" detail="These are design requirements and planned controls, not claims that every capability is already deployed.">
        {plannedControls.map(([icon, title, detail]) => <SecurityArchitectureCard key={title} icon={icon} title={title} detail={detail} />)}
      </InfoSection>

      <InfoSection title="Prototype data flow" detail="A production implementation would enforce controls at every boundary.">
        <VerticalPipeline steps={[
          { icon: 'phone-portrait-outline', title: 'Mobile App' },
          { icon: 'lock-closed-outline', title: 'Encrypted transport', detail: 'HTTPS / TLS' },
          { icon: 'git-network-outline', title: 'API Gateway / Backend' },
          { icon: 'finger-print-outline', title: 'Authentication + Authorization' },
          { icon: 'server-outline', title: 'Encrypted Data Store' },
          { icon: 'options-outline', title: 'Eligibility / Recommendation Engine' },
          { icon: 'library-outline', title: 'RAG / Knowledge Layer' },
          { icon: 'pulse-outline', title: 'Audit & Monitoring' },
        ]} />
      </InfoSection>

      <View style={[styles.note, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Text style={[ui.small, { color: colors.mutedForeground, lineHeight: 18 }]}>Production deployment would require formal threat modeling, privacy review, security testing, operational controls, and agency-specific requirements. This prototype is not a security certification.</Text>
      </View>
    </InfoScreen>
  );
}

const styles = StyleSheet.create({
  controlCard: { borderRadius: 20, padding: 17, marginTop: 22, flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  flexibleContent: { flex: 1, minWidth: 0 },
  note: { borderWidth: 1, borderRadius: 16, padding: 14, marginTop: 26 },
});
