import { authMonitor } from './monitoring';

/**
 * Configure auth monitoring alert thresholds
 * Alerts are triggered when metrics exceed thresholds within specified time windows
 */
export function configureAuthAlerts() {
  // Rate limit alerts
  authMonitor.addAlertCondition({
    metric: 'rate_limit_hit',
    threshold: 100, // 100 hits
    duration: 60 * 1000, // 1 minute
    severity: 'warning'
  });

  authMonitor.addAlertCondition({
    metric: 'rate_limit_hit',
    threshold: 1000, // 1000 hits
    duration: 5 * 60 * 1000, // 5 minutes
    severity: 'error'
  });

  // Authentication error alerts
  authMonitor.addAlertCondition({
    metric: 'auth_events_error',
    threshold: 10, // 10 errors
    duration: 60 * 1000, // 1 minute
    severity: 'warning'
  });

  authMonitor.addAlertCondition({
    metric: 'auth_events_error',
    threshold: 50, // 50 errors
    duration: 5 * 60 * 1000, // 5 minutes
    severity: 'error'
  });

  // Token refresh alerts
  authMonitor.addAlertCondition({
    metric: 'auth_events_refresh',
    threshold: 1000, // 1000 refreshes
    duration: 5 * 60 * 1000, // 5 minutes
    severity: 'warning'
  });

  // Token revocation alerts
  authMonitor.addAlertCondition({
    metric: 'auth_events_token_revoked',
    threshold: 100, // 100 revocations
    duration: 60 * 1000, // 1 minute
    severity: 'warning'
  });

  // Failed login alerts
  authMonitor.addAlertCondition({
    metric: 'auth_events_error',
    threshold: 5, // 5 failed attempts
    duration: 60 * 1000, // 1 minute
    severity: 'warning',
  });
}
