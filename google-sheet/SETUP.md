# Collect RSVP replies in a Google Sheet

Do this signed in to the Google account that should own the replies. It takes about five minutes.

1. Go to https://sheets.new to make a new sheet. Name it "Parita and Deep RSVPs". Only you can see it unless you share it.
2. Click **Extensions > Apps Script**.
3. Delete the code in the editor and paste in all of [Code.gs](Code.gs). Click the save icon.
4. Click **Deploy > New deployment**. Click the gear next to "Select type" and choose **Web app**.
5. Set **Execute as: Me** and **Who has access: Anyone**. Click **Deploy**.
6. Google asks for permission. Click **Authorize access**, choose your account, then **Advanced > Go to project (unsafe) > Allow**. This message appears because it is your own script.
7. Copy the **Web app URL** it shows (it ends in `/exec`).
8. Open `src/wedding.config.js` and paste it into `rsvp.sheetUrl`, then run `npm run build` and upload `dist` again.

To test, open the Web app URL in a browser. It should say "RSVP receiver is running". Then fill in the form on the site, and a row should appear in the sheet within a few seconds, with an email to the address you set in `NOTIFY_EMAIL` as well.

## Who can see the replies
Only you can open the sheet. To let someone else see it, click **Share** at the top right of the sheet and add their email. Choose **Viewer** so they cannot change anything.

"Who has access: Anyone" in step 5 only lets the invite send replies in. It does not let anyone read the sheet.

## If you change Code.gs later
Click **Deploy > Manage deployments**, edit the existing one, choose **New version**, and deploy. The address stays the same.
