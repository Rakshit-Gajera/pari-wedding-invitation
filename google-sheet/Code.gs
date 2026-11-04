/*
 * Receives RSVP replies from the wedding invite and adds each one as a row in this Google Sheet.
 * Setup steps are in SETUP.md next to this file.
 */
const SHEET_NAME = 'RSVP';
const HEADINGS = ['Received', 'Name', 'Phone', 'Events attending', 'Note'];
// Optional: reply emails go to this address. Leave empty to turn emails off.
const NOTIFY_EMAIL = 'you@example.com';

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const data = JSON.parse(e.postData.contents);
    // A hidden field that real guests never fill in, to turn away simple bots.
    if (data.website) return reply({ ok: true });

    const name = clean(data.name, 80);
    const phone = clean(data.phone, 30);
    if (!name || !phone) return reply({ ok: false, error: 'Name and phone are needed' });
    const events = Array.isArray(data.events) ? data.events.slice(0, 10).map((x) => clean(x, 40)).join(', ') : '';
    const note = clean(data.note, 500);

    const sheet = getSheet();
    sheet.appendRow([new Date(), name, phone, events || 'None chosen', note]);
    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(
        NOTIFY_EMAIL,
        'RSVP: ' + name,
        name + '\n' + phone + '\nEvents: ' + (events || 'None chosen') + (note ? '\nNote: ' + note : '')
      );
    }
    return reply({ ok: true });
  } catch (err) {
    return reply({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

// Opening the web address in a browser just shows that it is running.
function doGet() {
  return reply({ ok: true, message: 'RSVP receiver is running' });
}

function getSheet() {
  const book = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = book.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = book.insertSheet(SHEET_NAME);
    sheet.appendRow(HEADINGS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, HEADINGS.length).setFontWeight('bold');
    sheet.setColumnWidths(1, 1, 150);
    sheet.setColumnWidths(2, 3, 170);
    sheet.setColumnWidth(5, 320);
  }
  return sheet;
}

// Stops a value starting with = or + from being run as a formula in the sheet.
function clean(value, max) {
  const text = String(value == null ? '' : value).trim().slice(0, max);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}
