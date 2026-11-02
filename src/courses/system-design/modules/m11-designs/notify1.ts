import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-notify-1",
  module: "m11",
  title: "Design a notification system: the pipeline",
  level: "junior",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🧾", label: "Services", sub: "Billing, shipping, nightly jobs" },
      { icon: "🛂", label: "API servers", sub: "Check the caller, look up the user" },
      { icon: "🗄️", label: "Cache and database", sub: "Users, devices, settings" },
      { icon: "📬", label: "One queue per channel", sub: "iOS, Android, SMS, email" },
      { icon: "⚙️", label: "Workers", sub: "Call that channel's provider" },
      { icon: "📱", label: "Providers", sub: "APNs, FCM, SMS and email services" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a system that sends notifications to millions of users.\" Ask which channels, how fast they must arrive, which devices, what triggers a send, whether users can opt out, and how many go out a day." },
    { kind: "idea", text: "Say what you agreed: push to iPhones and Android phones, text messages and email. Soft real time, so a short delay under heavy load is fine. Services and schedules trigger sends, and opted-out users get nothing." },
    {
      kind: "example",
      title: "Sizing the sends",
      steps: [
        "Assume 20 million pushes, 3 million texts and 8 million emails a day. That's 31 million notifications in all.",
        "Divide by 86,400 seconds: about 231 pushes, 35 texts and 93 emails a second. That's about 360 a second in total, on average.",
        "Averages hide the peak. One campaign sends 3 million pushes in 10 minutes: 3 million divided by 600 seconds is 5,000 pushes a second.",
        "If one push worker makes 250 provider calls a second, the peak needs 5,000 divided by 250, which is 20 workers. The average needs just 1, so workers must autoscale.",
      ],
    },
    { kind: "idea", text: "A push goes from your server to Apple's push service, APNs, which delivers it to the iPhone. You send a small JSON payload with the title and text, plus a **device token**, the id for one app on one device." },
    { kind: "idea", text: "Android works the same way through Firebase Cloud Messaging, FCM. Where Google's services aren't available, as in mainland China, you use local push providers. Desktop browsers get **web push** through each browser's own push service." },
    { kind: "idea", text: "Texts and email go through a **third-party provider**, such as Twilio for SMS or SendGrid for email. They deal with phone carriers, spam filters and sender reputation, which is a lot of work to run yourself." },
    { kind: "idea", text: "When someone signs up or installs the app, the API servers save their email and phone in the user table, and each device token in a **device table**, one row per device, since one user can own several." },
    { kind: "idea", text: "The first design: services, such as a billing service or a nightly cron job, call one **notification server**. It builds each message and calls the right provider directly." },
    { kind: "idea", text: "Three things break. It's a single point of failure. The database, cache and sending share one box, so they can't grow separately. And slow work, like rendering emails and waiting on providers, blocks everything at peak." },
    { kind: "idea", text: "The fix starts by moving the database and cache onto their own machines. Then run many stateless **notification API servers** behind a load balancer, and let them autoscale with traffic." },
    { kind: "idea", text: "Each API server checks the caller is allowed, validates the email or phone number, reads the user, devices and settings from the cache or the database, then puts an event on a queue and replies at once." },
    { kind: "idea", text: "You know from the queues topic why each channel gets its own queue: iOS push, Android push, SMS and email. A provider outage stays in one queue, and each queue soaks up spikes while workers catch up." },
    { kind: "idea", text: "**Workers** for each channel take events off their queue and call that channel's provider, and each pool scales alone. Keep every provider behind a small interface so you can add or replace one without touching the rest." },
  ],
  tip: "Draw the pipeline left to right and give each box one job: API servers check and look up, a queue per channel buffers, workers call the providers.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-notify-1-q1",
      prompt: "The single notification server waits seconds on a slow email provider, and pushes pile up behind it at peak. Which change fixes the cause?",
      options: ["Give the server a faster CPU", "Add a read replica to the database", "Hand sends to queues and workers", "Cache user rows for longer"],
      answer: 2,
      explanation: "The server is stuck waiting on the provider, so the waiting has to move off the request path into queues drained by workers. A faster CPU doesn't speed up a remote provider, and the database and cache aren't what's slow.",
    },
    {
      kind: "mcq",
      id: "t-design-notify-1-q2",
      prompt: "A user has the app on a phone and a tablet. Where do their device tokens belong?",
      options: ["One row per device in a device table", "One token column on the user row", "Inside every notification event", "In the settings table, by channel"],
      answer: 0,
      explanation: "A device table with one row per device lets a push reach every device the user owns. One column holds only one token, events are short-lived copies, and settings hold choices, not addresses.",
    },
    {
      kind: "mcq",
      id: "t-design-notify-1-q3",
      prompt: "A campaign sends 1.8 million pushes in 15 minutes, and one push worker makes 200 provider calls a second. How many workers does the peak need?",
      options: ["2", "45", "100", "10"],
      answer: 3,
      explanation: "15 minutes is 900 seconds, and 1.8 million divided by 900 is 2,000 pushes a second. 2,000 divided by 200 is 10 workers. The other numbers come from using minutes instead of seconds or dividing the wrong way.",
    },
    {
      kind: "tf",
      id: "t-design-notify-1-q4",
      statement: "Keeping each provider behind its own small interface lets you swap one SMS provider for another without changing the API servers.",
      answer: true,
      explanation: "Only the SMS workers talk to the SMS provider. Replacing it changes the code behind that interface and nothing upstream.",
    },
    {
      kind: "tf",
      id: "t-design-notify-1-q5",
      statement: "Running many notification API servers removes the need for queues, because the load is spread across machines.",
      answer: false,
      explanation: "More servers still wait on slow providers, and a spike still lands all at once. Queues buffer the spike and keep one provider's slowness out of the others.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-notify-1-p1",
      prompt: "You send 6 million text messages a day, spread evenly. About how many is that per second?",
      options: ["About 690", "About 7", "About 69", "About 250"],
      answer: 2,
      explanation: "6 million divided by 86,400 seconds is about 69.4 a second.",
    },
    {
      kind: "tf",
      id: "t-design-notify-1-p2",
      statement: "A nightly cron job that emails daily summaries is one of the services that calls the notification API.",
      answer: true,
      explanation: "Triggers can be other services or schedules. Both call the same send API, so the rest of the pipeline treats them alike.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 10 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Apple Developer: Sending notification requests to APNs", url: "https://developer.apple.com/documentation/usernotifications/sending-notification-requests-to-apns", license: "Link only" },
    { title: "Firebase documentation: Firebase Cloud Messaging", url: "https://firebase.google.com/docs/cloud-messaging", license: "Link only" },
  ],
};

export default topic;
