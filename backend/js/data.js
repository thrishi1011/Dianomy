/* ═══════════════════════════════════════════════════════════
   DIANOMY — Data Module
   Mock delivery data and user-detail simulation.
   ═══════════════════════════════════════════════════════════ */

const mockRequests = [];

/**
 * Simulate fetching user details from campus systems.
 * In production this would be an API call to the institution directory.
 */
function simulateFetchUserDetails(email, provider) {
  provider = provider || 'email';
  const localPart = email.split('@')[0];
  const domain = email.split('@')[1] || '';

  // Derive readable name
  let name = localPart;
  if (localPart.includes('.')) {
    name = localPart.split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  } else if (localPart.includes('_')) {
    name = localPart.split('_').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
  } else {
    name = localPart.charAt(0).toUpperCase() + localPart.slice(1);
  }

  // Parse roll-number-style (e.g. ls25csb1a15 → year 2025, dept CSE)
  const rollMatch = localPart.match(/(\d{2})([a-zA-Z]{2,4})/);
  let year = '2025';
  let department = 'Computer Science';
  let rollNumber = localPart.toUpperCase();

  if (rollMatch) {
    const yearDigits = parseInt(rollMatch[1], 10);
    year = (yearDigits < 50 ? 2000 + yearDigits : 1900 + yearDigits).toString();
    const deptCode = rollMatch[2].toUpperCase();
    const deptMap = {
      CS: 'Computer Science', CSE: 'Computer Science', CSB: 'Computer Science',
      EC: 'Electronics & Communication', ECE: 'Electronics & Communication',
      EE: 'Electrical Engineering', EEE: 'Electrical Engineering',
      ME: 'Mechanical Engineering', CE: 'Civil Engineering',
      CH: 'Chemical Engineering', BT: 'Biotechnology',
      MM: 'Metallurgical Engineering', IT: 'Information Technology'
    };
    department = deptMap[deptCode] || deptCode;
  }

  return {
    email: email,
    name: name,
    year: year,
    rollNumber: rollNumber,
    phone: '+91 XXXXX XXXXX', // Placeholder for new users
    department: department,
    hostel: 'Not Set',
    avatarInitial: name.charAt(0).toUpperCase(),
    provider: provider
  };
}
