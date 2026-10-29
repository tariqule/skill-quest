import { Flow, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ThresholdLab } from "../labs";
import { AiRings, ConfusionMatrix, LearningTypes } from "../visuals";

/**
 * Domain 1: everything for this exam domain in one file.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Fundamentals of AI and ML",
    world: "The Training Grounds",
    weight: 20,
    emoji: "🧠",
    color: "#38bdf8",
    summary:
      "AI vs ML vs deep learning, learning types, the ML lifecycle, metrics, and the pre-built AWS AI services.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Explain basic AI concepts and terms",
      covers: [
        "AI, ML, deep learning, neural networks, computer vision, NLP, LLMs, GenAI, agentic AI",
        "Training vs inference; batch, real-time, asynchronous, and serverless inference",
        "Data types: labeled/unlabeled, tabular, time-series, image, text, structured/unstructured",
        "Supervised, unsupervised, and reinforcement learning",
      ],
    },
    {
      id: "1.2",
      title: "Identify practical use cases for AI",
      covers: [
        "Where AI adds value (decision support, scale, automation) and where it doesn't",
        "Regression vs classification vs clustering",
        "Real-world examples: vision, NLP, speech, recommendations, fraud, forecasting, agents",
        "Managed services: SageMaker AI, Transcribe, Translate, Comprehend, Lex, Polly",
        "When to pick traditional ML vs a foundation model (regulation, explainability, constraints)",
      ],
    },
    {
      id: "1.3",
      title: "Describe the AI/ML development lifecycle",
      covers: [
        "Pipeline stages and the AWS service for each (Bedrock, Amazon Quick, Kiro, SageMaker AI)",
        "Where models come from: open-source pre-trained vs custom-trained",
        "Running in production: managed API vs self-hosted",
        "MLOps: experiments, repeatability, monitoring, re-training",
        "Model metrics (accuracy, precision, recall, F1) and business metrics (ROI, cost per user)",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-rings",
      check: ["d1-04", "d1-24"],
      task: "1.1",
      title: "AI, ML, deep learning, GenAI: one picture",
      visual: <AiRings />,
      points: [
        "A model is what you get after an algorithm learns from data.",
        "Training = learning from data. Inference = using the trained model to predict.",
        "Computer vision works with images. NLP works with language.",
      ],
      tip: "If a question asks for the broadest term, it's AI. If it mentions neural networks with many layers, it's deep learning.",
    },
    {
      id: "d1-learning",
      check: ["d1-01", "d1-03"],
      task: "1.1",
      title: "Three ways machines learn",
      visual: <LearningTypes />,
      points: [
        "Labeled data (with answers) → supervised.",
        "No labels, find structure → unsupervised.",
        "Rewards and penalties from an environment → reinforcement.",
        "Foundation models are pre-trained with self-supervised learning on huge unlabeled data.",
      ],
    },
    {
      id: "d1-techniques",
      check: ["d1-28", "d1-30"],
      task: "1.2",
      title: "Pick the right technique",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📈", title: "Regression", text: "Predict a number: price, demand, temperature.", color: "#38bdf8" },
            { icon: "🏷️", title: "Classification", text: "Predict a category: spam/not spam, fraud/OK.", color: "#a78bfa" },
            { icon: "🫧", title: "Clustering", text: "Group similar things without labels: customer segments.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "AI helps when patterns are too complex for rules, or work must scale or be automated.",
        "Skip AI when a fixed rule gives the exact answer, or the cost outweighs the benefit.",
        "Prefer traditional ML when regulators demand explainability on structured data. Prefer FMs for open-ended language and content tasks.",
      ],
    },
    {
      id: "d1-services",
      check: ["d1-11", "d1-14"],
      task: "1.2",
      title: "Pre-built AI services: input → output",
      visual: (
        <ServiceRows
          rows={[
            { input: "🖼️ Image / video", service: "Rekognition", output: "Objects, faces, unsafe content" },
            { input: "📄 Scanned form", service: "Textract", output: "Text, tables, key-values" },
            { input: "💬 Text", service: "Comprehend", output: "Sentiment, entities, PII" },
            { input: "🎙️ Speech", service: "Transcribe", output: "Text transcript" },
            { input: "📝 Text", service: "Polly", output: "🔊 Lifelike speech" },
            { input: "🇬🇧 Text", service: "Translate", output: "🇫🇷 Another language" },
            { input: "🗣️ Conversation", service: "Lex", output: "Chatbot / voice bot" },
            { input: "👆 User clicks", service: "Personalize", output: "Recommendations" },
          ]}
        />
      ),
      points: [
        "These need no ML expertise: call an API and get results.",
        "Amazon SageMaker AI is for when you build, train, and deploy your own models.",
      ],
      tip: "Polly and Transcribe are opposites: Polly speaks text, Transcribe writes down speech.",
    },
    {
      id: "d1-lifecycle",
      check: ["d1-29", "d1-32"],
      task: "1.3",
      title: "The ML lifecycle",
      visual: (
        <Flow
          loop="Monitoring spots drift → re-train → redeploy (that's MLOps)"
          steps={[
            { icon: "🎯", label: "Business goal", sub: "Frame the problem and success metric" },
            { icon: "🧺", label: "Data", sub: "Collect, clean, label (SageMaker Ground Truth)" },
            { icon: "🏋️", label: "Train & evaluate", sub: "SageMaker AI training, JumpStart, Canvas" },
            { icon: "🚀", label: "Deploy", sub: "Managed API (Bedrock) or self-hosted endpoint" },
            { icon: "📡", label: "Monitor", sub: "SageMaker Model Monitor catches drift" },
          ]}
        />
      ),
      points: [
        "FMs come from open-source pre-trained models, providers in Bedrock, or your own training.",
        "MLOps = repeatable experiments, automated pipelines, monitoring, and re-training.",
      ],
    },
    {
      id: "d1-inference",
      check: ["d1-21", "d1-26"],
      task: "1.1",
      title: "Four ways to run inference",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "⚡", title: "Real-time", text: "Instant answers, always-on endpoint. Chat, fraud checks.", color: "#38bdf8" },
            { icon: "📦", title: "Batch", text: "Whole dataset offline, no endpoint. Nightly scoring.", color: "#a78bfa" },
            { icon: "📬", title: "Asynchronous", text: "Big payloads or long jobs, queued. Results later.", color: "#f59e0b" },
            { icon: "💤", title: "Serverless", text: "Spiky or rare traffic. Scales to zero; cold starts.", color: "#34d399" },
          ]}
        />
      ),
      points: ["Match the option to latency needs and traffic pattern. Cheapest for rare traffic: serverless. Cheapest for huge offline jobs: batch."],
    },
    {
      id: "d1-metrics",
      check: ["d1-07", "d1-08"],
      task: "1.3",
      title: "Precision vs recall: move the cutoff",
      visual: (
        <div className="grid gap-6">
          <ConfusionMatrix />
          <ThresholdLab />
        </div>
      ),
      points: [
        "F1 balances precision and recall.",
        "Regression uses error metrics: RMSE, MAE, R².",
        "Business metrics prove value: ROI, cost per user, development cost, customer feedback.",
      ],
      tip: "Missing a sick patient is worse → recall. Annoying customers with false alarms is worse → precision.",
    },
    {
      id: "d1-data-tuning",
      check: ["d1-49", "d1-53"],
      task: "1.1 · 1.3",
      title: "Data, features, and tuning",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🏷️", title: "Supervised", text: "All data labeled.", color: "#38bdf8" },
              { icon: "🌗", title: "Semi-supervised", text: "A little labeled data; the model pseudo-labels the rest.", color: "#a78bfa" },
              { icon: "🔁", title: "Self-supervised", text: "The model makes its own labels, e.g. predicting hidden words. How FMs pre-train.", color: "#f59e0b" },
              { icon: "🫧", title: "Unsupervised", text: "No labels; find structure.", color: "#34d399" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🦶", title: "Learning rate", text: "Step size per update. Too high overshoots; too low is slow." },
              { icon: "📦", title: "Batch size", text: "Examples per update. Small = steadier, slower." },
              { icon: "🔄", title: "Epochs", text: "Passes over the data. Too many can overfit." },
              { icon: "🧷", title: "Regularization", text: "Penalises complexity to fight overfitting." },
            ]}
          />
        </div>
      ),
      points: [
        "Exploratory data analysis (EDA) comes first: statistics and charts to understand the data and spot issues before modeling.",
        "Feature engineering turns raw data into useful inputs, for tables and for text or images alike.",
        "Fix overfitting with more or more varied data (augmentation), early stopping, tuned hyperparameters, or ensembles.",
        "Hyperparameters are set before training; SageMaker Automatic Model Tuning searches for the best values against a metric you choose.",
        "Edge inference runs a small model on the device: very low latency and works offline. A big remote model is more capable but needs a network.",
      ],
      tip: "If an answer says \"add more hyperparameters\" to fix overfitting, it's wrong: you adjust them, you don't add them.",
    },
    {
      id: "d1-services-custom",
      check: ["d1-57", "d1-60"],
      task: "1.2",
      title: "Customising the managed AI services",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "💬", title: "Comprehend", text: "Built-in entity recognition (people, places, dates), plus custom classification (your categories) and custom entities (e.g. policy numbers).", color: "#38bdf8" },
            { icon: "🎙️", title: "Transcribe", text: "Custom vocabularies for words (brands, acronyms); custom language models for domain context; toxicity detection from tone and text.", color: "#a78bfa" },
            { icon: "🔊", title: "Polly", text: "Lexicons (say AWS as 'Amazon Web Services'), SSML for pauses and emphasis, speech marks for lip-sync, several voice engines.", color: "#f59e0b" },
            { icon: "🖼️", title: "Rekognition", text: "Custom Labels trains on a few hundred of your images (e.g. your logo). Content moderation can route edge cases to human review.", color: "#34d399" },
            { icon: "🎁", title: "Personalize", text: "Recipes for each recommendation job: items for a user, ranking, similar items, trending items, next best action, user segments.", color: "#f87171" },
            { icon: "👥", title: "Mechanical Turk", text: "Crowdsourced human workers for simple tasks like labeling; plugs into A2I and Ground Truth.", color: "#94a3b8" },
          ]}
        />
      ),
      points: [
        "Pre-built services work out of the box, and most can be customised with your own data without building a model.",
        "Medical variants exist for clinical speech and text (Transcribe Medical, Comprehend Medical).",
      ],
      tip: "Words the service mishears → custom vocabulary. Whole domain context it misunderstands → custom language model.",
    },
    {
      id: "d1-sagemaker-tools",
      check: ["d1-61", "d1-63"],
      task: "1.3",
      title: "The SageMaker AI toolbox",
      visual: (
        <Flow
          loop="SageMaker Pipelines automates the whole loop (CI/CD for ML)"
          steps={[
            { icon: "🧹", label: "Prepare", sub: "Data Wrangler, Ground Truth, Feature Store" },
            { icon: "🧪", label: "Build & experiment", sub: "Studio, JumpStart, Canvas, MLflow tracking" },
            { icon: "🏋️", label: "Train & tune", sub: "Built-in algorithms, Automatic Model Tuning" },
            { icon: "📚", label: "Govern", sub: "Model Registry, Model Cards, Role Manager" },
            { icon: "📡", label: "Deploy & monitor", sub: "Endpoints, Model Monitor, Model Dashboard" },
          ]}
        />
      ),
      points: [
        "Feature Store keeps features in one place so teams reuse them for training and inference.",
        "MLflow on SageMaker tracks experiments and runs; the Model Registry versions and approves models.",
        "Built-in algorithms cover common jobs: linear models, KNN, k-means, PCA (fewer features), anomaly detection, DeepAR time-series forecasting.",
        "Network isolation mode runs training containers with no outbound internet access at all.",
      ],
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-learning",
      prompt:
        "A retailer has years of transactions labeled as 'fraud' or 'not fraud' and wants to flag new fraudulent transactions. Which type of learning fits?",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Self-supervised learning"],
      answer: [0],
      explanation:
        "Labeled historical data with a known target (fraud / not fraud) is a supervised classification problem.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-learning",
      prompt:
        "A marketing team wants to group customers into segments, but has no predefined segment labels. Which technique should they use?",
      options: ["Linear regression", "Clustering (unsupervised learning)", "Binary classification", "Reinforcement learning"],
      answer: [1],
      explanation:
        "Grouping unlabeled data by similarity is clustering, an unsupervised technique (for example k-means).",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-learning",
      prompt: "A robot learns to navigate a warehouse by receiving rewards for reaching targets and penalties for collisions. What is this?",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Transfer learning"],
      answer: [2],
      explanation:
        "Learning by trial and error through rewards and penalties from an environment is reinforcement learning. AWS DeepRacer is the classic AWS example.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "Which statement best describes the relationship between AI, ML, and deep learning?",
      options: [
        "Deep learning is a subset of ML, which is a subset of AI",
        "AI is a subset of ML, which is a subset of deep learning",
        "ML and deep learning are unrelated fields within AI",
        "Deep learning is a subset of AI but not of ML",
      ],
      answer: [0],
      explanation:
        "AI is the broad field. ML is AI that learns from data. Deep learning is ML that uses multi-layer neural networks.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "A model scores 99% accuracy on training data but 62% on new data. What is the most likely problem?",
      options: ["Underfitting", "Overfitting", "Data drift", "Low latency"],
      answer: [1],
      explanation:
        "Great training performance with poor generalization is overfitting: the model memorized noise. Fix with more data, regularization, or a simpler model.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "A model performs poorly on both training and test data. What is this called?",
      options: ["Overfitting", "Underfitting", "High variance", "Concept drift"],
      answer: [1],
      explanation:
        "Underfitting (high bias) means the model is too simple to capture the pattern. Try more features, a more complex model, or longer training.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "In a cancer screening model, missing an actual positive case is very costly. Which metric should you prioritize?",
      options: ["Precision", "Recall", "Accuracy", "RMSE"],
      answer: [1],
      explanation:
        "Recall = TP / (TP + FN). It measures how many actual positives you catch, so it matters most when false negatives are expensive.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "A spam filter must avoid sending legitimate emails to the spam folder. Which metric matters most?",
      options: ["Recall", "Precision", "R-squared", "Perplexity"],
      answer: [1],
      explanation:
        "Precision = TP / (TP + FP). High precision means few false positives, so good emails are rarely flagged as spam.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which metric balances precision and recall into a single number?",
      options: ["F1 score", "AUC", "Mean absolute error", "BLEU"],
      answer: [0],
      explanation: "F1 is the harmonic mean of precision and recall, useful for imbalanced classes.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which metrics are used to evaluate a regression model that predicts house prices? (Choose two.)",
      options: ["Root mean squared error (RMSE)", "F1 score", "Mean absolute error (MAE)", "Recall"],
      answer: [0, 2],
      explanation:
        "Regression predicts continuous numbers, so you measure error size: RMSE, MAE, and R-squared. F1 and recall are classification metrics.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A company wants to detect objects and faces in images without building a model. Which AWS service should it use?",
      options: ["Amazon Comprehend", "Amazon Rekognition", "Amazon Textract", "Amazon Polly"],
      answer: [1],
      explanation:
        "Amazon Rekognition is the pre-built computer vision service for images and video: objects, faces, labels, and content moderation.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A bank wants to extract fields and tables from scanned loan application forms. Which service fits best?",
      options: ["Amazon Textract", "Amazon Comprehend", "Amazon Rekognition", "Amazon Translate"],
      answer: [0],
      explanation:
        "Amazon Textract goes beyond OCR: it extracts text, key-value pairs from forms, and tables from scanned documents.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A support team wants to find the sentiment and key phrases in thousands of customer reviews. Which service?",
      options: ["Amazon Transcribe", "Amazon Lex", "Amazon Comprehend", "Amazon Rekognition"],
      answer: [2],
      explanation:
        "Amazon Comprehend is the NLP service for sentiment, entities, key phrases, language detection, and PII detection in text.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A call center needs to convert recorded calls into text for analysis. Which service?",
      options: ["Amazon Polly", "Amazon Transcribe", "Amazon Translate", "Amazon Lex"],
      answer: [1],
      explanation:
        "Amazon Transcribe is speech-to-text. Amazon Polly is the reverse: text-to-speech. (Transcribe Call Analytics adds call-specific insights.)",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-services",
      prompt: "Which service lets you build conversational chatbots with voice and text, the same technology behind Alexa?",
      options: ["Amazon Lex", "Amazon Transcribe", "Amazon Polly", "Amazon Personalize"],
      answer: [0],
      explanation: "Amazon Lex builds conversational interfaces using automatic speech recognition and natural language understanding.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-services",
      prompt: "An e-commerce site wants real-time product recommendations based on user behavior, with no ML expertise. Which service?",
      options: ["Amazon Forecast", "Amazon Personalize", "Amazon Comprehend", "Amazon Fraud Detector"],
      answer: [1],
      explanation: "Amazon Personalize provides managed recommendation and personalization, the same tech used on Amazon.com.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "What is the correct order of the core ML development lifecycle?",
      options: [
        "Deploy → train → collect data → monitor",
        "Define problem → collect and prepare data → train and evaluate → deploy → monitor",
        "Train → define problem → deploy → collect data",
        "Collect data → deploy → train → define problem",
      ],
      answer: [1],
      explanation:
        "Business goal and problem framing come first, then data collection and processing (including feature engineering), training, evaluation, deployment, and monitoring.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Which SageMaker feature detects when a deployed model's data or prediction quality drifts over time?",
      options: ["SageMaker Clarify", "SageMaker Model Monitor", "SageMaker Ground Truth", "SageMaker Canvas"],
      answer: [1],
      explanation:
        "SageMaker Model Monitor continuously watches production endpoints for data drift, model quality drift, bias drift, and feature attribution drift.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A team needs humans to label thousands of images to create a training dataset. Which service helps?",
      options: ["SageMaker Ground Truth", "SageMaker Data Wrangler", "Amazon Rekognition", "SageMaker Feature Store"],
      answer: [0],
      explanation:
        "SageMaker Ground Truth manages data labeling with human workers (your team, vendors, or Mechanical Turk) plus active learning.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Business analysts with no coding skills want to build ML predictions using a visual, no-code interface. Which tool?",
      options: ["SageMaker Studio notebooks", "SageMaker Canvas", "AWS Glue", "Amazon EMR"],
      answer: [1],
      explanation: "SageMaker Canvas is the no-code ML tool for business analysts: point, click, and get predictions.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-inference",
      prompt:
        "A company needs predictions for millions of records once a night and does not need instant responses. Which inference type is most cost-effective?",
      options: ["Real-time inference", "Batch transform", "Serverless inference", "Asynchronous inference"],
      answer: [1],
      explanation:
        "Batch transform processes large datasets offline with no persistent endpoint. Real-time is for low latency, serverless for intermittent traffic, async for large payloads or long processing.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "When is AI/ML NOT a good fit for a problem?",
      options: [
        "When the outcome must be exactly determined by simple, fixed rules",
        "When there is lots of historical data",
        "When patterns are too complex to code by hand",
        "When predictions need to scale to millions of users",
      ],
      answer: [0],
      explanation:
        "If a deterministic rule or calculation gives the exact answer, ML adds cost and uncertainty with no benefit. ML shines when rules are hard to write.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "What is a hyperparameter?",
      options: [
        "A value the model learns from data during training, such as a weight",
        "A setting chosen before training that controls how the model learns, such as learning rate",
        "The final prediction output of a model",
        "A label in the training dataset",
      ],
      answer: [1],
      explanation:
        "Hyperparameters (learning rate, epochs, batch size) are set before training. Parameters (weights, biases) are learned. SageMaker Automatic Model Tuning searches hyperparameters for you.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What best describes agentic AI?",
      options: [
        "AI systems that plan steps, use tools, and take actions toward a goal with limited human input",
        "Any model that generates images",
        "A rules engine with fixed if/then logic",
        "A database that stores embeddings",
      ],
      answer: [0],
      explanation:
        "GenAI creates content when asked. Agentic AI goes further: it breaks a goal into steps, calls tools or APIs, checks results, and keeps going until the task is done.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-inference",
      prompt: "A model must process large video files, each taking several minutes, and callers don't need an instant reply. Which SageMaker AI inference option fits?",
      options: ["Asynchronous inference", "Real-time inference", "Batch transform", "Serverless inference"],
      answer: [0],
      explanation:
        "Asynchronous inference queues requests with large payloads or long processing times and notifies you when results are ready. It can scale to zero when idle.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-inference",
      prompt: "A model gets only a few requests a day at unpredictable times. The team wants to pay nothing when it's idle. Which inference option fits?",
      options: ["Serverless inference", "Real-time inference on a large instance", "Batch transform", "A dedicated GPU cluster"],
      answer: [0],
      explanation: "Serverless inference spins up compute on demand and scales to zero between requests, so intermittent traffic costs little. Expect some cold-start latency.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-learning",
      type: "match",
      prompt: "Match each data example to its data type.",
      pairs: [
        ["Hourly temperature readings for a year", "Time-series data"],
        ["A spreadsheet of customers with columns", "Structured (tabular) data"],
        ["Customer support emails", "Unstructured text data"],
        ["Photos tagged 'cat' or 'dog'", "Labeled image data"],
      ],
      explanation:
        "Time-series is ordered by time. Tabular data has rows and columns. Free text is unstructured. Labels (cat/dog) are what make data usable for supervised learning.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-techniques",
      type: "match",
      prompt: "Match each business problem to the ML technique.",
      pairs: [
        ["Predict next month's sales in dollars", "Regression"],
        ["Decide if an email is spam or not", "Classification"],
        ["Group shoppers with similar habits, no labels", "Clustering"],
      ],
      explanation: "Regression predicts a number. Classification predicts a category. Clustering finds groups in unlabeled data.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-lifecycle",
      type: "order",
      prompt: "Put the stages of the ML development lifecycle in order.",
      items: [
        "Identify the business goal",
        "Collect and prepare data",
        "Train and evaluate the model",
        "Deploy the model",
        "Monitor and re-train",
      ],
      explanation:
        "Start from the business problem, then data, then training and evaluation, then deployment. Monitoring catches drift and triggers re-training, which loops the cycle.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-techniques",
      prompt:
        "A bank must explain every credit decision to regulators and has years of clean tabular data. Which approach is usually most appropriate?",
      options: [
        "A traditional, interpretable ML model such as a decision tree or linear model",
        "A large multimodal foundation model",
        "An image generation model",
        "A chatbot with high temperature",
      ],
      answer: [0],
      explanation:
        "When regulation demands explainability and the data is structured, traditional ML is often the better fit. FMs shine for unstructured, open-ended tasks.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Which are core MLOps practices? (Choose two.)",
      options: [
        "Monitoring models in production and re-training when performance drops",
        "Making experiments repeatable and pipelines automated",
        "Training once and never updating the model",
        "Keeping model versions only on a laptop",
        "Skipping evaluation to ship faster",
      ],
      answer: [0, 1],
      explanation: "MLOps applies DevOps ideas to ML: tracked experiments, repeatable automated pipelines, scalable systems, monitoring, and re-training.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A startup wants to use a foundation model without managing any servers or GPUs. Which way of using the model fits best?",
      options: [
        "Call it through a managed API such as Amazon Bedrock",
        "Self-host it on EC2 GPU instances",
        "Train a new model from scratch",
        "Run it on employee laptops",
      ],
      answer: [0],
      explanation:
        "A managed API means AWS runs the infrastructure and you pay per use. Self-hosting gives more control but you manage scaling, patching, and cost.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which is a BUSINESS metric for judging an ML solution, rather than a model metric?",
      options: ["Return on investment (ROI)", "F1 score", "Recall", "Precision"],
      answer: [0],
      explanation: "Model metrics (accuracy, precision, recall, F1) measure predictions. Business metrics (ROI, cost per user, customer feedback, development cost) measure value.",
    },
    // ── Practice set 2 ──
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "An insurer wants to predict the dollar amount of each new claim from past claims. Which ML technique fits?",
      options: ["Regression", "Binary classification", "Clustering", "Dimensionality reduction"],
      answer: [0],
      explanation: "The target is a continuous number (dollars), so it's a regression problem.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-learning",
      prompt: "A security team wants to spot unusual network traffic, but it has no labeled examples of attacks. Which approach fits best?",
      options: ["Unsupervised anomaly detection", "Supervised classification", "Reinforcement learning", "Text-to-speech"],
      answer: [0],
      explanation: "With no labels, unsupervised methods learn what normal looks like and flag data points that don't fit.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-learning",
      prompt: "Which of these are examples of unstructured data? (Choose two.)",
      options: [
        "Audio recordings of support calls",
        "Product photos",
        "A relational table of orders",
        "A CSV of daily sales totals",
        "Timestamped sensor readings in fixed columns",
      ],
      answer: [0, 1],
      explanation: "Audio, images, video, and free text have no fixed schema, so they're unstructured. Tables and CSVs with columns are structured.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What does inference mean in machine learning?",
      options: [
        "Using a trained model to make predictions on new data",
        "Collecting data for training",
        "Labeling images by hand",
        "Choosing which algorithm to use",
      ],
      answer: [0],
      explanation: "Training teaches the model. Inference is when the trained model is used to produce predictions or outputs.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A team turns a raw timestamp into new inputs such as 'day of week' and 'is holiday' to help a model learn. What is this called?",
      options: ["Feature engineering", "Hyperparameter tuning", "Model deployment", "Inference"],
      answer: [0],
      explanation: "Feature engineering transforms raw data into inputs (features) that make patterns easier for a model to learn.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "Only 1% of transactions are fraud. A model that labels everything 'not fraud' scores 99% accuracy. What is the problem?",
      options: [
        "Class imbalance makes accuracy misleading; use precision, recall, or F1",
        "The model is underfitting because accuracy is too high",
        "The data has too many features",
        "Accuracy is the only metric that matters here",
      ],
      answer: [0],
      explanation: "With imbalanced classes, accuracy hides the fact that the model catches zero fraud. Recall and F1 expose it.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Why keep a test dataset that the model never sees during training?",
      options: [
        "To estimate how the model will perform on new, unseen data",
        "To make training faster",
        "To increase the number of features",
        "To store the model's weights",
      ],
      answer: [0],
      explanation: "A held-out test set gives an honest estimate of real-world performance. A validation set is used for tuning along the way.",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A company must find and redact names, addresses, and phone numbers in thousands of text support tickets. Which service fits?",
      options: ["Amazon Comprehend", "Amazon Polly", "Amazon Rekognition", "Amazon Translate"],
      answer: [0],
      explanation: "Amazon Comprehend can detect and redact personally identifiable information (PII) in text.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Data scientists want a visual tool to clean, transform, and explore training data with little code. Which SageMaker AI feature fits?",
      options: ["SageMaker Data Wrangler", "SageMaker Model Monitor", "Amazon Lex", "AWS CloudTrail"],
      answer: [0],
      explanation: "SageMaker Data Wrangler helps import, prepare, and visualise data for ML with minimal code.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "An MLOps team needs one place to catalog model versions and track which version is approved for production. Which feature fits?",
      options: ["SageMaker Model Registry", "Amazon Translate", "SageMaker Ground Truth", "Amazon Polly"],
      answer: [0],
      explanation: "The Model Registry stores model versions with metadata and approval status, which supports repeatable, governed deployments.",
    },
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-lifecycle",
      type: "order",
      prompt: "Put the steps of a supervised learning project in order.",
      items: [
        "Collect and label data",
        "Split data into training and test sets",
        "Train the model",
        "Evaluate on the test set",
        "Deploy the model",
      ],
      explanation: "Labeled data comes first. You train on one split, evaluate on data the model hasn't seen, and deploy only when it's good enough.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-techniques",
      type: "match",
      prompt: "Match each AI application type to its example.",
      pairs: [
        ["Computer vision", "Reading license plates from camera footage"],
        ["Natural language processing", "Detecting the intent of support emails"],
        ["Speech recognition", "Turning a voicemail into text"],
        ["Recommendation system", "Suggesting products from browsing history"],
        ["Forecasting", "Predicting next quarter's inventory demand"],
      ],
      explanation: "Vision works with images, NLP with language, speech recognition with audio, recommenders with behaviour, and forecasting with time series.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-services",
      type: "match",
      prompt: "Match each AWS service to the task it does best.",
      pairs: [
        ["Amazon Translate", "Localise a website into Spanish"],
        ["Amazon Polly", "Read news articles aloud"],
        ["Amazon Textract", "Pull totals from scanned invoices"],
        ["Amazon Lex", "Build a voice bot that books appointments"],
        ["Amazon Personalize", "Recommend movies to each viewer"],
      ],
      explanation: "Each of these is a pre-built AI service you call through an API. No model training is needed.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "Which are realistic business benefits of AI/ML? (Choose two.)",
      options: [
        "Automating repetitive tasks at scale",
        "Supporting faster, better-informed human decisions",
        "Guaranteeing every output is correct",
        "Removing the need for any data",
        "Eliminating all operating costs",
      ],
      answer: [0, 1],
      explanation: "AI adds value through automation, scale, and decision support. It never guarantees correctness and always needs data.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What is a neural network?",
      options: [
        "A model made of layers of connected nodes whose weights are learned from data",
        "A database of hand-written rules",
        "A physical network cable between servers",
        "A spreadsheet formula",
      ],
      answer: [0],
      explanation: "Neural networks pass data through layers of nodes. Training adjusts the connection weights. Deep learning uses many layers.",
    },
    // ── Practice set 3 ──
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A team has 500 labeled images and 50,000 unlabeled ones. The model learns from the labeled set, labels the rest itself, then retrains on everything. What is this?",
      options: ["Semi-supervised learning", "Reinforcement learning", "Unsupervised clustering", "Transfer learning"],
      answer: [0],
      explanation: "Semi-supervised learning mixes a little labeled data with a lot of unlabeled data. The model's own labels are called pseudo-labels.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "How are large language models usually pre-trained on huge amounts of text without human labels?",
      options: ["Self-supervised learning: the model predicts parts of the text it hides from itself", "Fully supervised learning with hand-labeled sentences", "Reinforcement learning from rewards only", "K-means clustering"],
      answer: [0],
      explanation: "Self-supervised learning creates labels from the data itself, such as predicting the next or masked word.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Before building a model, a data scientist plots distributions and correlations to understand the data and find problems. Which phase is this?",
      options: ["Exploratory data analysis (EDA)", "Model deployment", "Hyperparameter tuning", "Inference"],
      answer: [0],
      explanation: "EDA uses statistics and visualisations to understand data quality, patterns, and relationships before modeling.",
    },
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Training loss jumps around and never settles. Which hyperparameter is the most likely cause?",
      options: ["The learning rate is too high", "The test set is too large", "The number of features is too small", "The model is deployed in the wrong Region"],
      answer: [0],
      explanation: "A high learning rate takes big steps and can overshoot the best solution. A lower rate converges more precisely but more slowly.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A model is overfitting. Which actions help? (Choose two.)",
      options: ["Use more, or more varied, training data (including data augmentation)", "Stop training early", "Add more hyperparameters", "Train for many more epochs", "Remove the validation set"],
      answer: [0, 1],
      explanation: "More diverse data and early stopping both reduce overfitting. You adjust hyperparameters rather than add them, and more epochs usually makes overfitting worse.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Which hyperparameter controls how many times the model passes over the whole training dataset?",
      options: ["Number of epochs", "Batch size", "Learning rate", "Regularization"],
      answer: [0],
      explanation: "Too few epochs can underfit; too many can overfit.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A factory needs AI predictions on machines with unreliable internet and very low latency. What fits best?",
      options: ["A small model running on the edge device", "A large model called over the internet", "Batch transform overnight", "A bigger context window"],
      answer: [0],
      explanation: "Edge inference with a small language model gives very low latency and works offline, at the cost of less capability.",
    },
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Two classifiers are compared across all decision thresholds. Model A has an AUC-ROC of 0.89 and model B 0.52. What does this tell you?",
      options: ["Model A separates the classes much better; B is close to random guessing", "Model B is more accurate", "Both models are equally good", "AUC-ROC only applies to regression"],
      answer: [0],
      explanation: "AUC-ROC runs from 0 to 1. Around 0.5 means no better than chance, and closer to 1 means better separation of the classes.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "Amazon Transcribe keeps mishearing your product names and acronyms. What is the quickest fix?",
      options: ["Add a custom vocabulary", "Switch to Amazon Polly", "Raise the temperature", "Use Amazon Translate first"],
      answer: [0],
      explanation: "Custom vocabularies teach Transcribe specific words and phrases. Custom language models help when it misunderstands the context of a whole domain.",
    },
    {
      id: "d1-58",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "A company wants Amazon Polly to always read \"AWS\" as \"Amazon Web Services\". Which feature does this?",
      options: ["Lexicons", "Speech marks", "Custom Labels", "Toxicity detection"],
      answer: [0],
      explanation: "Lexicons define how specific text is pronounced. SSML adds pauses and emphasis, and speech marks mark where words start and end, for lip-sync.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "A brand wants to find its own logo in social media photos. Which service and feature fit?",
      options: ["Amazon Rekognition Custom Labels", "Amazon Comprehend custom classification", "Amazon Textract", "Amazon Lex"],
      answer: [0],
      explanation: "Custom Labels trains a model on a modest set of your labeled images to detect objects that are specific to you.",
    },
    {
      id: "d1-60",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "An insurer wants to pull policy numbers out of customer emails. Which Amazon Comprehend capability fits?",
      options: ["Custom entity recognition", "Sentiment analysis", "Language detection", "Built-in key phrases only"],
      answer: [0],
      explanation: "Custom entity recognition finds terms specific to your business. Custom classification sorts whole documents into categories you define.",
    },
    {
      id: "d1-61",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "A team wants every model to be built, trained, tested, and deployed through an automated, repeatable workflow. Which SageMaker AI feature fits?",
      options: ["SageMaker Pipelines", "SageMaker Canvas", "Amazon Polly", "SageMaker Ground Truth"],
      answer: [0],
      explanation: "Pipelines is CI/CD for ML: automated, repeatable workflows with fewer manual steps and errors.",
    },
    {
      id: "d1-62",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "Data scientists want one place to store engineered features so other teams can reuse them for training and inference. Which feature fits?",
      options: ["SageMaker Feature Store", "SageMaker Model Monitor", "AWS Artifact", "SageMaker JumpStart"],
      answer: [0],
      explanation: "Feature Store centralises features. Data Wrangler can publish into it, and features are discoverable in SageMaker Studio.",
    },
    {
      id: "d1-63",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "An ML team already uses the open-source MLflow to track experiments and wants it managed inside SageMaker. What should they use?",
      options: ["MLflow tracking servers on Amazon SageMaker AI", "Amazon Lex", "AWS Config", "Amazon Translate"],
      answer: [0],
      explanation: "SageMaker can launch managed MLflow tracking servers, integrated with SageMaker Studio, to track runs and experiments.",
    },
    {
      id: "d1-64",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      type: "match",
      prompt: "Match each SageMaker AI built-in algorithm to its job.",
      pairs: [
        ["Principal Component Analysis (PCA)", "Reduce the number of features"],
        ["K-means", "Find groups in unlabeled data"],
        ["DeepAR", "Forecast time-series data"],
        ["Linear learner", "Predict a number or a class"],
      ],
      explanation: "Built-in algorithms let you train common model types without writing the algorithm yourself.",
    },
  ],

  cards: [
    { id: "s-sagemaker", domain: "d1", kind: "service", term: "Amazon SageMaker AI", definition: "Build, train, and deploy your own ML models end to end" },
    { id: "s-canvas", domain: "d1", kind: "service", term: "SageMaker Canvas", definition: "No-code ML predictions for business analysts" },
    { id: "s-monitor", domain: "d1", kind: "service", term: "SageMaker Model Monitor", definition: "Detect data and model quality drift in production" },
    { id: "s-groundtruth", domain: "d1", kind: "service", term: "SageMaker Ground Truth", definition: "Human data labeling to build training datasets" },
    { id: "s-rekognition", domain: "d1", kind: "service", term: "Amazon Rekognition", definition: "Image and video analysis: objects, faces, moderation" },
    { id: "s-comprehend", domain: "d1", kind: "service", term: "Amazon Comprehend", definition: "NLP: sentiment, entities, key phrases, PII in text" },
    { id: "s-textract", domain: "d1", kind: "service", term: "Amazon Textract", definition: "Extract text, forms, and tables from scanned documents" },
    { id: "s-transcribe", domain: "d1", kind: "service", term: "Amazon Transcribe", definition: "Speech to text" },
    { id: "s-polly", domain: "d1", kind: "service", term: "Amazon Polly", definition: "Text to lifelike speech" },
    { id: "s-translate", domain: "d1", kind: "service", term: "Amazon Translate", definition: "Neural machine translation between languages" },
    { id: "s-lex", domain: "d1", kind: "service", term: "Amazon Lex", definition: "Conversational chatbots with voice and text" },
    { id: "s-personalize", domain: "d1", kind: "service", term: "Amazon Personalize", definition: "Real-time personalized recommendations" },
    { id: "c-agentic", domain: "d1", kind: "concept", term: "Agentic AI", definition: "AI that plans steps, uses tools, and acts toward a goal" },
    { id: "c-async", domain: "d1", kind: "concept", term: "Asynchronous inference", definition: "Queue big or slow requests; get results later" },
    { id: "c-serverless", domain: "d1", kind: "concept", term: "Serverless inference", definition: "On-demand compute that scales to zero for spiky traffic" },
    { id: "c-batch", domain: "d1", kind: "concept", term: "Batch transform", definition: "Offline predictions over a whole dataset, no endpoint" },
    { id: "c-overfit", domain: "d1", kind: "concept", term: "Overfitting", definition: "Great on training data, poor on new data" },
    { id: "c-underfit", domain: "d1", kind: "concept", term: "Underfitting", definition: "Poor on both training and new data" },
    { id: "c-precision", domain: "d1", kind: "concept", term: "Precision", definition: "TP / (TP + FP): how many flagged positives are real" },
    { id: "c-recall", domain: "d1", kind: "concept", term: "Recall", definition: "TP / (TP + FN): how many real positives you caught" },
    { id: "c-f1", domain: "d1", kind: "concept", term: "F1 score", definition: "Harmonic mean of precision and recall" },
    { id: "c-semisup", domain: "d1", kind: "concept", term: "Semi-supervised learning", definition: "A little labeled data plus lots of unlabeled data (pseudo-labeling)" },
    { id: "c-eda", domain: "d1", kind: "concept", term: "Exploratory data analysis", definition: "Stats and charts to understand data before modeling" },
    { id: "c-lr", domain: "d1", kind: "concept", term: "Learning rate", definition: "Size of each weight update; too high overshoots" },
    { id: "c-epochs", domain: "d1", kind: "concept", term: "Epochs", definition: "Passes over the full training data" },
    { id: "c-aucroc", domain: "d1", kind: "concept", term: "AUC-ROC", definition: "Classifier quality across thresholds; 0.5 = random, 1 = perfect" },
    { id: "c-edge", domain: "d1", kind: "concept", term: "Edge inference", definition: "Small model on the device: low latency, works offline" },
    { id: "s-pipelines", domain: "d1", kind: "service", term: "SageMaker Pipelines", definition: "Automated CI/CD workflows to build, train, and deploy models" },
    { id: "s-featurestore", domain: "d1", kind: "service", term: "SageMaker Feature Store", definition: "Central store to share and reuse ML features" },
    { id: "s-mturk", domain: "d1", kind: "service", term: "Amazon Mechanical Turk", definition: "Crowdsourced human workers for simple tasks like labeling" },
    { id: "c-customvocab", domain: "d1", kind: "concept", term: "Transcribe custom vocabulary", definition: "Teach Transcribe brand names, acronyms, and jargon" },
  ],

  challenges: [
    {
      id: "ch-catch-all-fraud",
      domain: "d1",
      lesson: "d1-metrics",
      title: "Catch every fraud",
      goal: "Move the cutoff until recall hits 100%: every red dot is flagged.",
      hint: "Recall goes up as the cutoff goes down. Watch what happens to precision.",
      takeaway: "Maximising recall means more false alarms. That's the trade-off when missing a positive is costly.",
      render: (onSolved) => <ThresholdLab goal="catchAll" onSolved={onSolved} />,
    },
    {
      id: "ch-no-false-alarms",
      domain: "d1",
      lesson: "d1-metrics",
      title: "Zero false alarms",
      goal: "Find a cutoff with 100% precision (no blue dots flagged) that still catches at least 2 frauds.",
      hint: "Push the cutoff high, past the highest-scoring good transaction.",
      takeaway: "High precision means every alert is real, but recall drops: lots of fraud slips through.",
      render: (onSolved) => <ThresholdLab goal="noFalseAlarms" onSolved={onSolved} />,
    },
  ],
});
