/**
 * useFormValidation — Reusable form validation hook
 *
 * Usage:
 *   const { errors, sessionErrors, validate, validateField, clearError } = useFormValidation(formData, rules);
 *
 * Rule options per field:
 *   required: true | 'Custom message'
 *   email: true | 'Custom message'
 *   phone: true | 'Custom message'     (Vietnamese 10-digit)
 *   url: true | 'Custom message'
 *   minLength: N | { value: N, message: '...' }
 *   maxLength: N | { value: N, message: '...' }
 *
 * For nested array (classSessions), pass validateSessions(sessions, sessionRules) separately.
 */
import { useState } from 'react';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^(0[3-9]\d{8}|\+84[3-9]\d{8})$/;
const URL_REGEX = /^https?:\/\/.+/;

function runRule(value, rules) {
  const val = typeof value === 'string' ? value.trim() : (value ?? '');

  if (rules.required) {
    if (!val || val === '') {
      return typeof rules.required === 'string' ? rules.required : 'Vui lòng không bỏ trống trường này.';
    }
  }

  if (!val) return null; // Optional — skip remaining checks if empty

  if (rules.email) {
    if (!EMAIL_REGEX.test(val)) {
      return typeof rules.email === 'string' ? rules.email : 'Địa chỉ email không hợp lệ.';
    }
  }

  if (rules.phone) {
    const cleaned = val.replace(/\s/g, '');
    if (!PHONE_REGEX.test(cleaned)) {
      return typeof rules.phone === 'string' ? rules.phone : 'Số điện thoại không hợp lệ (VD: 0912345678).';
    }
  }

  if (rules.url) {
    if (!URL_REGEX.test(val)) {
      return typeof rules.url === 'string' ? rules.url : 'Đường dẫn URL không hợp lệ (phải bắt đầu bằng http/https).';
    }
  }

  if (rules.minLength !== undefined) {
    const min = typeof rules.minLength === 'object' ? rules.minLength.value : rules.minLength;
    const msg = typeof rules.minLength === 'object' ? rules.minLength.message : `Tối thiểu ${min} ký tự.`;
    if (val.length < min) return msg;
  }

  if (rules.maxLength !== undefined) {
    const max = typeof rules.maxLength === 'object' ? rules.maxLength.value : rules.maxLength;
    const msg = typeof rules.maxLength === 'object' ? rules.maxLength.message : `Tối đa ${max} ký tự.`;
    if (val.length > max) return msg;
  }

  return null;
}

function runAllRules(data, rules) {
  const errors = {};
  for (const field in rules) {
    const error = runRule(data[field], rules[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

// Validate nested array of objects (e.g. classSessions)
export function validateSessions(sessions, sessionRules) {
  return sessions.map(session => {
    const errs = {};
    for (const field in sessionRules) {
      // Special cross-field: endDate must be after startDate
      if (field === 'endDate' && session.startDate && session.endDate) {
        if (new Date(session.endDate) <= new Date(session.startDate)) {
          errs.endDate = 'Ngày kết thúc phải sau ngày bắt đầu.';
          continue;
        }
      }
      const error = runRule(session[field], sessionRules[field]);
      if (error) errs[field] = error;
    }
    return errs; // {} means no error for this session
  });
}

export default function useFormValidation(formData, rules) {
  const [errors, setErrors] = useState({});

  // Full validate — returns true if valid
  const validate = () => {
    const newErrors = runAllRules(formData, rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Single field validate (onBlur)
  const validateField = (fieldName) => {
    if (!rules[fieldName]) return;
    const error = runRule(formData[fieldName], rules[fieldName]);
    setErrors(prev => ({ ...prev, [fieldName]: error || undefined }));
  };

  // Clear error for a field (onFocus or onChange)
  const clearError = (fieldName) => {
    setErrors(prev => {
      const next = { ...prev };
      delete next[fieldName];
      return next;
    });
  };

  return { errors, validate, validateField, clearError };
}
