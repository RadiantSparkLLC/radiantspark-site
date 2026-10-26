# Radiant Spark website

One responsive website with a Global overview and separate U.S. and India company views. The header includes working links for Technology USA, Industries India, About, Careers, Contact, and Privacy.

- Global overview: Radiant Spark Global, with the two companies shown separately.
- United States: Radiant Spark LLC and Spark IT Consulting, including six service practices.
- India: RDNT Sparkle Industries LLP and four divisions.
- Careers and Contact: `info@radiantsparkllc.com` is used for both companies as requested. Include the relevant company and division in the email subject.
- Privacy: the static site includes no forms, analytics, or advertising trackers. The hosting and email providers may process data under their own terms.
- Radiant Intelligence: a floating site assistant that answers common questions using prepared website information. It is not connected to a live AI service.

The site uses the supplied logo and images, a locally drawn particle sphere, responsive layouts, and expandable FAQs. The animation does not load an external library.

## Preview

Open `index.html` in a browser. The header switches among Global, U.S., and India views. Use `#usa` or `#india` to open a country view directly. Use the floating **Ask Radiant Intelligence** button in the lower-right corner to open the chat assistant.

## Publish on GitHub Pages

Upload `index.html`, `styles.css`, `site.js`, and the full `assets/` folder to the repository root. Then in **Settings → Pages**, choose **Deploy from a branch**, `main`, and `/ (root)`. `usa.html` remains an optional redirect for older preview links.

The supplied product images are crops from screenshots, not original 4K source files.


## Install as a mobile app

This site includes a web app manifest, home screen icons, and offline cache support. After publishing over HTTPS (GitHub Pages provides HTTPS), Android visitors can choose **Install app** or **Add to Home screen** from the browser menu. On iPhone/iPad, open the site in Safari, tap **Share**, then **Add to Home Screen**. This creates an installable web app; publishing native APK/IPA builds through app stores requires separate signing and store accounts.

