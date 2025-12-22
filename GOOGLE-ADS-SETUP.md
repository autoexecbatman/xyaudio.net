# Google Ads Conversion Tracking Setup Guide

## ✅ What's Already Done

1. **Google Ads tag installed** on main page (index.html)
2. **Thank you page created** (thank-you.html) with conversion tracking placeholder
3. **Professional design** matching your site's glassmorphism theme

---

## 📋 Next Steps (Follow in Order)

### STEP 1: Create Conversion Action in Google Ads

1. Go to your **Google Ads account**
2. Navigate to: **Tools & Settings** (wrench icon) → **Measurement** → **Conversions**
3. Click **"+ New conversion action"**
4. Select **"Website"**
5. Configure the conversion:

   **Conversion Settings:**
   - **Goal**: Purchase
   - **Conversion name**: "SoundAnalyzer Purchase" (or whatever you prefer)
   - **Value**:
     - Select "Use different values for each conversion"
     - OR "Use the same value" = $5 (or 18 NIS)
   - **Count**: **One** (important! only count each purchase once)
   - **Conversion window**: 30 days (default)
   - **Include in "Conversions"**: Yes

6. Click **"Create and Continue"**

### STEP 2: Get Your Conversion Label

After creating the conversion, Google will show you the conversion code. Look for this line:

```javascript
gtag('event', 'conversion', {
    'send_to': 'AW-17824320357/XXXXX',  // ← XXXXX is your conversion label
    ...
});
```

**Copy the part after the slash** (the `XXXXX` part). This is your **conversion label**.

### STEP 3: Update thank-you.html

1. Open `thank-you.html`
2. Find this line (around line 48):
   ```javascript
   'send_to': 'AW-17824320357/CONVERSION_LABEL_HERE',
   ```
3. Replace `CONVERSION_LABEL_HERE` with your actual conversion label
4. Save the file

**Example:**
If your conversion code is `AW-17824320357/AbC123XyZ`, then change to:
```javascript
'send_to': 'AW-17824320357/AbC123XyZ',
```

### STEP 4: Configure Gumroad Redirect

1. Go to **Gumroad** → **Products** → Your SoundAnalyzer product
2. Click **"Edit"** on your product
3. Scroll to **"Redirect URL after purchase"** (or "Thank you page URL")
4. Enter: `https://xyaudio.net/thank-you.html`
   - Or if using GitHub Pages: `https://autoexecbatman.github.io/xyaudio.net/thank-you.html`
5. Save changes

### STEP 5: Test the Tracking

1. **Enable test conversions** (optional but recommended):
   - In Google Ads Conversions, click on your conversion
   - Change counting to **"Every"** temporarily (for testing)

2. **Make a test purchase**:
   - Use a real card OR Gumroad test mode
   - Complete the purchase
   - Verify you land on the thank-you page

3. **Check if conversion fired**:
   - Go to Google Ads → Tools → Conversions
   - Click on your "SoundAnalyzer Purchase" conversion
   - Look for test conversion (may take 3-24 hours to show)
   - Alternative: Use **Google Tag Assistant** Chrome extension to verify immediately

4. **After testing**: Change conversion counting back to **"One"**

---

## 🔍 Verification & Troubleshooting

### How to Verify It's Working

**Method 1: Google Tag Assistant (Immediate)**
1. Install Google Tag Assistant Chrome extension
2. Visit your thank-you.html page
3. Click the extension icon
4. Should show: "Google Ads Conversion Tracking" tag fired

**Method 2: Google Ads Dashboard (3-24 hours)**
1. Go to Google Ads → Conversions
2. Click on your conversion action
3. Should show conversion count increasing

### Common Issues

**Problem**: Conversions not showing in Google Ads
- **Check**: Is the conversion label correct in thank-you.html?
- **Check**: Did customer actually land on thank-you page?
- **Wait**: Can take up to 24 hours for conversions to appear

**Problem**: Customer doesn't see thank-you page
- **Check**: Is redirect URL set correctly in Gumroad?
- **Check**: Is thank-you.html published/deployed?

**Problem**: Double counting conversions
- **Fix**: Make sure conversion count is set to "One" not "Every"

---

## 📊 Expected Behavior

### When someone purchases:
1. Customer clicks "Buy & Download" button on your site
2. Gumroad checkout opens (external)
3. Customer completes payment on Gumroad
4. Gumroad redirects to: `https://xyaudio.net/thank-you.html`
5. Thank you page loads
6. Google Ads conversion fires automatically
7. Conversion appears in Google Ads dashboard (within 24 hours)

---

## 🎯 Performance Tracking

After setup, you'll be able to track:
- **Total conversions**: How many sales from Google Ads
- **Conversion rate**: % of clicks that become purchases
- **Cost per conversion**: How much you spent per sale
- **ROAS**: Return on Ad Spend

Access in Google Ads:
- **Campaigns** tab → See conversion column
- **Reports** → Conversion report

---

## 💰 Conversion Value Configuration

Currently set to **$5 USD** per conversion.

If you want to change:
1. Edit `thank-you.html`
2. Find: `'value': 5.0,`
3. Change to your price (e.g., `18.0` for 18 NIS)
4. Update currency: `'currency': 'ILS',` (if needed)

---

## 🔐 Privacy & Compliance

The Google Ads tag:
- ✅ Only tracks conversions (purchases), not browsing behavior
- ✅ No personal information collected
- ✅ Complies with Gumroad's privacy policy
- ✅ No cookies stored (server-side conversion tracking)

For GDPR compliance in EU:
- Add cookie consent banner (not included in this setup)
- Or use Google's consent mode (advanced setup)

---

## 📝 Files Modified

- ✅ `index.html` - Added Google Ads tag
- ✅ `thank-you.html` - Created with conversion tracking
- ✅ Removed old Google tag (AW-1042201614)
- ✅ Updated to new tag (AW-17824320357)

---

## 🆘 Need Help?

If you run into issues:

1. **Verify tag installation**:
   - View page source on index.html
   - Should see: `gtag.js?id=AW-17824320357`

2. **Test conversion firing**:
   - Open thank-you.html in browser
   - Open browser console (F12)
   - Should NOT see any errors
   - Use Tag Assistant to verify

3. **Contact Google Ads Support**:
   - Tools → Help → Contact Support
   - They can check if tag is firing correctly

---

## ✨ Optional Enhancements (Future)

Want to improve tracking? Consider:

1. **Enhanced Conversions** (more accurate):
   - Pass customer email to Google Ads
   - Requires Gumroad webhook setup

2. **Dynamic Transaction IDs**:
   - Use Gumroad sale ID as transaction_id
   - Prevents duplicate conversion counting

3. **Google Analytics 4 Integration**:
   - Track full customer journey
   - See behavior before purchase

4. **Remarketing Tag**:
   - Retarget visitors who didn't purchase
   - Show ads to people who viewed your site

---

## 🚀 You're All Set!

Once you complete Steps 1-4 above, your conversion tracking will be live and working!

Conversions will automatically be attributed to your Google Ads campaigns, helping you optimize your ad spend and maximize ROI.

---

**Questions?** Email: xyaudiomail@gmail.com
