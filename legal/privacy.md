# Privacy Policy

Effective date: October 27, 2026

Sculpt is operated by Jacob Lagesse, based in California, USA. This policy covers the Sculpt app, website and related support. For privacy questions or requests, email [sculpt.app.support@gmail.com](mailto:sculpt.app.support@gmail.com) or write to Jacob Lagesse, 655 Bonanza Ct, Sunnyvale, CA 94087, USA.

Sculpt uses AI body analysis personalized workout planning and optional food tracking to guide adult fitness. This policy explains the data handled by the app and its services.

## Account and fitness data

Supabase processes your account identifier, sign-in details, questionnaire answers (including birth date, gender, measurements, activity and goals), scan results and explanations, dated weights, and saved routines, private custom exercises and workout logs to operate and synchronize your account. Apple or Google provides the identity information you choose to share when signing in. We use your birth date to check adult eligibility and derive age for estimates.

## Body scan photos and AI

Full body scan photos are stored privately on your device, excluded from backups and app exports. Before upload, Sculpt crops above the shoulders, masks any detected faces remaining in the crop and removes photo metadata. With your explicit permission, cropped photos and relevant age, gender, height, weight, activity, physique goals, approximate outline dimensions, saved scan results and recent workout history are sent through Supabase to OpenAI for photo guidance and analysis. AI workout generation uses your selected days and duration, goals, training experience, muscle preferences, comparable historical muscle scores and trends, recent exercise performance and preferences, and relevant exercise catalog entries. Generating a new routine from these inputs does not upload photos; importing an existing routine sends images as described below. Sculpt does not add your name, email or full birth date to these AI prompts. Photo cropping reduces identifiability but cannot guarantee anonymity.

## Importing workout routines

When you choose Read my routine in Import your routine, up to seven selected workout screenshots or photos are sent through Supabase to OpenAI to extract exercise names, workout days, weights, sets and repetitions and match movements against relevant exercise-library entries. Sculpt resizes and re-encodes these images to remove source metadata. Unlike body scan uploads, routine-import images are not automatically cropped above the shoulders or masked for faces: the full selected image content is sent, including any names, faces, messages or other personal information visible in it. Crop out unrelated information and only upload content you have permission to share. Sculpt does not add your account name or email to the import prompt, but cannot remove information visible in the image for you. Source images are held temporarily for import and are not saved in your Sculpt cloud account; the extracted draft and saved routine may be retained.

## Food tracking and food photos

Food names, portions, barcode results and food photos in your diary are stored privately on this device and excluded from backups. An inline notice below Analyze photo explains the sharing. When you tap Analyze photo, a resized, metadata-stripped copy of the food photo is sent through Supabase to OpenAI to estimate its nutrition. Food images are not cropped or face-masked; only photograph food and avoid including people or private information. Sculpt does not save these images in a cloud photo library. Photo estimates and package data may be incomplete or inaccurate; you can review and edit every value before saving. Barcode lookup sends the package barcode, without your food photo or account identity, from Sculpt’s server to [Open Food Facts](https://world.openfoodfacts.org/) for product nutrition data. Numeric meal contributions (calories, protein, carbohydrate and fat), dates, technical entry identifiers and daily totals are stored in Supabase for account synchronization. Food names, barcode values and images are not included in these database records or food analytics. Daily totals may include entries saved on your other devices; their detailed diaries and images remain on those devices. Deleted food stops contributing to totals; minimal numeric tombstones support safe synchronization. Food scan request IDs, operation type and timestamps enforce a limit of 100 food photo analyses per account across devices in any rolling seven-day period, and a separate limit of 100 barcode lookups per rolling 24 hours. Each admitted photo analysis counts, including re-analysis and attempts that later fail; rejected requests do not consume photo allowance. Records older than eight days are removed on your next food scan; account deletion removes them immediately. These technical records contain no photos, food names, barcode values or nutrition content. Local diaries are removed when you erase app data or delete your account on this phone; other devices’ local caches are not remotely erased. Deleting the app removes local food photos but does not remove your account’s synced totals.

## AI permission and retention

Sculpt asks for explicit AI data-sharing permission before onboarding and a new subscription. If you do not agree, setup does not continue. Your agreement is saved for your account on this device. Future scans, routine imports and AI plans run when you request them. You can withdraw AI permission in Profile & settings → Privacy & guidance → Withdraw AI permission. This stops new AI scans, routine imports and plans for your account on this device, while saved results and paid logging remain available. Permission on other devices is managed separately. Withdrawal does not undo processing already started or cancel Apple billing. You can review the disclosure and agree again in Settings. Account deletion is also available in Settings. Contact support for questions or requests about previously processed data. This permission is separate from the analytics described below. Cropped scan photos and routine-import images are temporary backend request inputs rather than stored in a Sculpt cloud photo library. Imported routine drafts and routines you save can be retained with your account, but do not contain the source images. Provider retention, security and safety policies still apply; Sculpt does not claim Zero Data Retention. OpenAI requests disable stored responses, which does not eliminate all provider retention. Review [OpenAI data controls](https://developers.openai.com/api/docs/guides/your-data) and [Supabase privacy information](https://supabase.com/privacy).

## Subscriptions

Apple handles App Store payment information. RevenueCat processes your Sculpt account identifier, purchase and entitlement details, and technical purchase information to validate access and restore subscriptions. Sculpt does not receive your card details. See [RevenueCat privacy information](https://www.revenuecat.com/privacy).

## Sign-in provider information

Google Sign-In may also process device identifiers, sign-in usage and diagnostic information, and approximate region inferred from network information under [Google's privacy policy](https://policies.google.com/privacy). Sculpt does not request phone-number or location scopes. Apple sign-in is governed by [Apple's privacy information](https://www.apple.com/legal/privacy/data/en/sign-in-with-apple/). Provider SDK privacy declarations are included in the app bundle.

## Onboarding analytics — PostHog

Sculpt automatically sends limited onboarding screen/step names, active time spent, completion events and starting-scan success/failure categories to PostHog, linked to your Sculpt account UUID and a per-onboarding session identifier. Questionnaire answers, body and routine images, prompts and AI response text, individual scan scores, measurements, names and email addresses are excluded. No anonymous device identifier, session replay, automatic screen/interaction capture, global crash reporting or remote technical logs are added by this integration. Post-onboarding workout, purchase and AI-performance analytics are disabled. Analytics is separate from AI permission and has no in-app opt-in or opt-out switch. Withdrawing AI permission does not disable onboarding analytics. Network services still receive technical request information needed to deliver and secure requests. See [PostHog privacy information](https://posthog.com/privacy).

## Analytics retention and deletion

Signing out or deleting your account cancels pending deliveries on this device; processing already started cannot be undone. Events are not saved to a persistent offline queue or automatically retried. Previously received records follow the provider’s retention policies. Account deletion also requests deletion of the account-linked PostHog person, associated events and any associated session recordings. Provider erasure is asynchronous; failed requests remain queued for retry. You do not need to email separately to initiate this deletion. Contact [sculpt.app.support@gmail.com](mailto:sculpt.app.support@gmail.com) for privacy questions and requests about your data.

## Use and sharing

These providers process data to deliver authentication, storage, purchases, analytics, diagnostics and the AI features you request. Sculpt does not sell fitness data, use it for targeted advertising, or request advertising tracking access. Services also process technical request information, such as IP addresses, for delivery, security and abuse prevention. Third-party services have their own retention and privacy terms; contact support with questions about your data. Service providers receiving Sculpt data must protect it consistently with this policy and applicable data-protection obligations. We do not authorize use of the fitness data we send for advertising.

## Storage and deletion

Custom exercises are private to the account that creates them and are not shared with other users. Account-linked profile, custom exercises, scan results and training history remain until you delete them or your account. Progress → Saved scans lets you remove individual scans or their local photos. Profile & settings → Delete account removes your profile and starts deletion of associated backend data, authentication, Apple sign-in authorization RevenueCat customer records and account-linked PostHog history. Cleanup retries if a provider is unavailable; RevenueCat and PostHog deletion may finish asynchronously. Minimal private deletion-job records are retained to complete and audit erasure. Deleting your account does not cancel Apple billing; cancel through Apple subscription settings. Signed-out account caches on other devices are not remotely erased from those devices; they are protected locally and removed when that device processes account deletion or you remove the app.

## Device storage and security

Sensitive local databases and scan photos are excluded from backups. Requests use HTTPS; backend access is scoped to authenticated accounts. No security or anonymization method is perfect.

## Adults and policy updates

Sculpt is intended for adults aged 18 and over and is not a medical service. Updates to data-sharing purposes require updated permission where applicable. For data questions, use Help & support in the app.

## Contact Sculpt

For support, privacy requests or questions about this policy, email [sculpt.app.support@gmail.com](mailto:sculpt.app.support@gmail.com). Include your app version and a description of the issue. Do not email body photos, passwords, payment details or identity documents. Account deletion is available directly in the app; no support email is required to delete your account.

## Website visits

The public website has no account form or advertising trackers added by Sculpt. GitHub Pages may process your IP address and ordinary request information to serve and secure the site, as described in [GitHub's privacy statement](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement). Emailing support sends your message through your email provider and our Google-hosted mailbox. External links lead to services with their own privacy practices.

## Your privacy rights

Depending on your location and applicable law, you may have rights to know or access the information we hold; obtain a copy or portable record; correct information; request deletion; restrict or object to processing; withdraw consent; and appeal a decision about a request. You may also complain to your local privacy regulator. California residents may have rights under applicable California privacy laws, including protection against unlawful discrimination for exercising their rights.

Send requests to sculpt.app.support@gmail.com, with enough information to identify your Sculpt account and the request. We use proportionate identity verification and handle authorized-agent requests where required. We respond within applicable legal deadlines, explain permitted extensions or refusals, and provide available appeal information. A paid subscription is not required to exercise privacy rights. To appeal, contact the same email with "Privacy appeal" in the subject. An app export may cover only device data; contact us for a broader account-data request.

## Legal bases and international processing

Where a legal basis is required, we rely on performance of our agreement for necessary account and requested services; legitimate interests in operating and securing the service and responding to requests, balanced against your rights; compliance with legal obligations; and consent where required. Sensitive health-related processing also requires an applicable additional legal condition, including explicit consent where required.

We operate in the United States. Providers may process information in the United States and other countries, whose privacy laws may differ from yours. Where applicable law requires transfer safeguards, transfers are subject to those requirements, such as an applicable adequacy decision or approved contractual safeguards. Contact us for information about recipients, processing locations and safeguards relevant to your information, or to request an available copy of the applicable safeguard.
