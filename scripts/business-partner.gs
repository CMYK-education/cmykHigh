/**
 * CMYK High — Business Partner form backend (Google Apps Script)
 *
 * Setup:
 * 1. Create a Google Sheet named e.g. "CMYK Business Partners"
 * 2. Extensions → Apps Script, paste this file
 * 3. Set SHEET_NAME / NOTIFY_EMAIL below
 * 4. Deploy → New deployment → Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the /exec URL into business.html → ENDPOINT
 *
 * Behavior mirrors the family waitlist flow:
 * - Accepts POST JSON (text/plain or application/json)
 * - Appends a row to the sheet
 * - Emails the business contact + notifies your team
 */

var SHEET_NAME = 'Partners';
var NOTIFY_EMAIL = 'hello@cmykhigh.com'; // change if needed

function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var row = flattenPartner(data);
    appendRow_(row);
    sendEmails_(data);
    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

function doGet() {
  return jsonResponse_({
    ok: true,
    service: 'CMYK High business partner intake',
    usage: 'POST JSON from business.html'
  });
}

function flattenPartner(data) {
  var skills = data.skills || [];
  var skillSummary = skills.map(function (s) {
    if (!s.applicable) return s.name + ': N/A';
    return s.name + ': ' + s.minimumLevel + ' (' + s.minimumLabel + ')';
  }).join(' | ');

  var skillNotes = skills
    .filter(function (s) { return s.note; })
    .map(function (s) { return s.name + ': ' + s.note; })
    .join('\n');

  return [
    data.submittedAt || new Date().toISOString(),
    data.companyName || '',
    data.website || '',
    data.industry || '',
    data.worksite || '',
    data.contactName || '',
    data.contactEmail || '',
    data.contactPhone || '',
    data.supervisorName || '',
    data.supervisorEmail || '',
    data.supervisorPhone || '',
    data.startTerm || '',
    data.duration || '',
    data.internCount || '',
    data.locationType || '',
    data.compensation || '',
    data.dressCode || '',
    data.duties || '',
    skillSummary,
    skillNotes,
    data.otherInfo || '',
    data.commitSpot ? 'Yes' : 'No',
    data.agreeContract ? 'Yes' : 'No',
    JSON.stringify(data.skills || [])
  ];
}

function appendRow_(row) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Submitted At',
      'Company',
      'Website',
      'Industry',
      'Worksite',
      'Contact Name',
      'Contact Email',
      'Contact Phone',
      'Supervisor Name',
      'Supervisor Email',
      'Supervisor Phone',
      'Start Term',
      'Duration',
      'Intern Count',
      'Location Type',
      'Compensation',
      'Dress Code',
      'Duties',
      'Skill Minimums',
      'Skill Notes',
      'Other Info',
      'Commit Spot',
      'Agree Contract',
      'Skills JSON'
    ]);
  }

  sheet.appendRow(row);
}

function sendEmails_(data) {
  var company = data.companyName || 'your company';
  var contactEmail = data.contactEmail;
  var contactName = data.contactName || 'there';

  if (contactEmail) {
    MailApp.sendEmail({
      to: contactEmail,
      subject: 'CMYK High — partnership interest received (' + company + ')',
      body:
        'Hi ' + contactName + ',\n\n' +
        'Thanks for committing partnership interest with CMYK High and designing an intern role for ' + company + '.\n\n' +
        'Term: ' + (data.startTerm || '') + '\n' +
        'Length: ' + (data.duration || '') + '\n' +
        'Interns: ' + (data.internCount || '') + '\n\n' +
        'We’ll follow up to confirm details, agreements (safety/supervision), and next steps. ' +
        'Student placements begin no earlier than Spring 2028, after Fall 2027 skills training.\n\n' +
        '— CMYK High\n' +
        'hello@cmykhigh.com\n'
    });
  }

  if (NOTIFY_EMAIL) {
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: 'New business partner commitment — ' + company,
      body:
        'New business partnership form submitted.\n\n' +
        'Company: ' + company + '\n' +
        'Contact: ' + (data.contactName || '') + ' <' + (data.contactEmail || '') + '> · ' + (data.contactPhone || '') + '\n' +
        'Industry: ' + (data.industry || '') + '\n' +
        'Worksite: ' + (data.worksite || '') + '\n' +
        'Term: ' + (data.startTerm || '') + '\n' +
        'Duration: ' + (data.duration || '') + '\n' +
        'Interns: ' + (data.internCount || '') + '\n' +
        'Arrangement: ' + (data.locationType || '') + '\n' +
        'Dress code: ' + (data.dressCode || '') + '\n\n' +
        'Duties:\n' + (data.duties || '') + '\n\n' +
        'Other info:\n' + (data.otherInfo || '') + '\n\n' +
        'Skills JSON:\n' + JSON.stringify(data.skills || [], null, 2) + '\n'
    });
  }
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
