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
      "What AI, machine learning and deep learning are, the ways a model can learn, how an ML project runs from start to finish, how you measure a model, and the ready-made AI services on AWS.",
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
    // ── Start here ──
    {
      id: "d1-start-what",
      level: "beginner",
      check: ["aif-b1-01", "aif-b1-02"],
      task: "1.1",
      title: "What AI and machine learning are",
      visual: (
        <Flow
          steps={[
            { icon: "🖼️", label: "Lots of examples", sub: "Thousands of photos labeled cat or dog" },
            { icon: "🧠", label: "Learning", sub: "The computer finds the patterns on its own" },
            { icon: "📦", label: "A model", sub: "What it learned, saved and ready to use" },
            { icon: "🐶", label: "A guess", sub: "Show it a new photo and it says: dog" },
          ]}
        />
      ),
      points: [
        "**Artificial intelligence (AI)** is any computer system that does something we'd normally call smart, like recognising a face or answering a question.",
        "**Machine learning (ML)** is the most common way to build AI today. Instead of writing rules, you show the computer lots of examples and it works out the pattern.",
        "Think of teaching a child what a dog is. You don't list rules about ears and tails. You point at dogs until they get it.",
        "What the computer learns gets saved as a **model**. You then hand the model new things and it makes a guess, called a **prediction**.",
      ],
      tip: "On the exam, AI is the widest term. Machine learning is one way to do AI, so every ML system is AI, but not the other way round.",
    },
    {
      id: "d1-start-train",
      level: "beginner",
      check: ["aif-b1-03", "aif-b1-04"],
      task: "1.1",
      title: "Learning first, then using it",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "📚", title: "Training", text: "The model studies examples and learns from them. Slow, done once or now and then.", color: "#38bdf8" },
            { icon: "🚗", title: "Inference", text: "The finished model answers new questions. Fast, done every time someone uses it.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "Every ML model has two phases. **Training** is when it learns from examples. **Inference** is when you use the finished model to get an answer.",
        "It's like learning to drive. The lessons are training. Every trip you take afterwards is inference.",
        "Training usually needs lots of data and computing power. Inference happens over and over, often in a fraction of a second.",
        "The examples a model learns from are its **training data**. Better, more varied examples usually give a better model.",
      ],
      tip: "If a question talks about a model making predictions for real users, that's inference, not training.",
    },
    {
      id: "d1-start-aws",
      level: "beginner",
      check: ["aif-b1-05", "aif-b1-06"],
      task: "1.2",
      title: "Ready-made AI on AWS",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🍽️", title: "Order from the menu", text: "Pre-built AI services like **Amazon Rekognition** or **Amazon Polly**. Send data, get an answer. No ML skills needed.", color: "#f59e0b" },
            { icon: "👩‍🍳", title: "Cook it yourself", text: "**Amazon SageMaker AI** gives you the kitchen to build, train and run your own models.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "**AWS** (Amazon Web Services) rents out computing over the internet. That includes AI you can use without building anything.",
        "Think of a restaurant. The pre-built AI services are dishes on the menu: you order, and the answer arrives ready to eat.",
        "For example, **Amazon Rekognition** looks at photos, and **Amazon Polly** turns written text into speech.",
        "When nothing on the menu fits, **Amazon SageMaker AI** is the kitchen where you build and train a model of your own.",
      ],
      tip: "Exam questions that say \"no ML expertise\" or \"quickly\" usually want a pre-built service, not SageMaker AI.",
    },

    // ── Exam lessons ──
    {
      id: "d1-rings",
      check: ["d1-04", "d1-24"],
      task: "1.1",
      title: "AI, ML, deep learning, GenAI: one picture",
      visual: <AiRings />,
      points: [
        "A **model** is what you end up with after an algorithm has learned from data.",
        "**Training** is when the model learns from examples. **Inference** is when you use the finished model to make a prediction, like asking it to tag a new photo.",
        "**Computer vision** is AI that works with images and video. **Natural language processing (NLP)** is AI that works with written or spoken language.",
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
        "If every example in your data comes with the right answer, like photos already tagged \"cat\" or \"dog\", you're doing **supervised learning**.",
        "If the data has no answers and you want the model to find structure, like groups of similar customers, that's **unsupervised learning**.",
        "If the model learns by trying things and getting rewards or penalties, like a robot learning not to bump into walls, that's **reinforcement learning**.",
        "Foundation models are pre-trained with **self-supervised learning**. They learn from huge amounts of unlabeled data by making up their own practice questions.",
        "Unsupervised learning also powers **anomaly detection**: spotting records that look unlike the rest, such as an odd card payment.",
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
            { icon: "📈", title: "Regression", text: "Predict a number, like a price, next week's demand or tomorrow's temperature.", color: "#38bdf8" },
            { icon: "🏷️", title: "Classification", text: "Predict a category, like spam or not spam, fraud or fine.", color: "#a78bfa" },
            { icon: "🫧", title: "Clustering", text: "Group similar things when you have no labels, like customer segments.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "AI helps when the patterns are too messy to write as rules, or when the work needs to happen at a huge scale or automatically.",
        "Skip AI when a fixed rule already gives the exact answer, like adding sales tax, or when the cost is bigger than the benefit.",
        "Pick traditional ML when regulators want every decision explained and your data sits in tables.",
        "Pick a foundation model for open-ended work with language and content, like drafting replies or summarising documents.",
        "**Interpretability** is how easily a person can see why a model made a prediction. A decision tree is easier to interpret than a deep neural network.",
      ],
    },
    {
      id: "d1-services",
      check: ["d1-11", "d1-14"],
      task: "1.2",
      title: "Pre-built AI services: what goes in, what comes out",
      visual: (
        <ServiceRows
          rows={[
            { input: "🖼️ Image or video", service: "Rekognition", output: "Objects, faces, unsafe content" },
            { input: "📄 Scanned form", service: "Textract", output: "Text, tables, form fields" },
            { input: "💬 Text", service: "Comprehend", output: "Sentiment, names, personal data" },
            { input: "🎙️ Speech", service: "Transcribe", output: "A written transcript" },
            { input: "📝 Text", service: "Polly", output: "🔊 Natural-sounding speech" },
            { input: "🇬🇧 Text", service: "Translate", output: "🇫🇷 Another language" },
            { input: "🗣️ Conversation", service: "Lex", output: "A chatbot or voice bot" },
            { input: "👆 User clicks", service: "Personalize", output: "Recommendations" },
          ]}
        />
      ),
      points: [
        "You don't need any ML skills for these. You call the service, send your data, and get results back.",
        "**Amazon SageMaker AI** is for when you want to build, train and deploy a model of your own instead.",
        "**Amazon Kendra** is ML-powered enterprise search. It answers natural-language questions from your documents, using built-in connectors to your data sources.",
      ],
      tip: "Polly and Transcribe are opposites. Polly reads text out loud. Transcribe writes down what people say.",
    },
    {
      id: "d1-lifecycle",
      check: ["d1-29", "d1-32"],
      task: "1.3",
      title: "The ML lifecycle",
      visual: (
        <Flow
          loop="When monitoring spots drift, you re-train and redeploy. Running that loop well is MLOps."
          steps={[
            { icon: "🎯", label: "Business goal", sub: "Decide the problem and how you'll measure success" },
            { icon: "🧺", label: "Data", sub: "Collect, clean and label it (SageMaker Ground Truth)" },
            { icon: "🏋️", label: "Train and evaluate", sub: "SageMaker AI training, JumpStart, Canvas" },
            { icon: "🚀", label: "Deploy", sub: "A managed API (Bedrock) or your own endpoint" },
            { icon: "📡", label: "Monitor", sub: "SageMaker Model Monitor catches drift" },
          ]}
        />
      ),
      points: [
        "A foundation model can come from three places: an open-source pre-trained model, a provider inside Amazon Bedrock, or your own training.",
        "**MLOps** means running ML like good software: repeatable experiments, automated pipelines, monitoring in production, and re-training when results slip.",
        "SageMaker helps at each step. **Ground Truth** labels data and **Data Wrangler** prepares it. **Feature engineering** turns raw columns into useful inputs, and training tunes **hyperparameters** such as the learning rate.",
        "**Model Registry** tracks and approves model versions, **Model Monitor** watches live models for drift, and **SageMaker Canvas** lets analysts build models with no code.",
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
            { icon: "⚡", title: "Real-time", text: "Instant answers from an endpoint that's always on. Good for chat or fraud checks.", color: "#38bdf8" },
            { icon: "📦", title: "Batch", text: "Scores a whole dataset offline with no endpoint. Good for nightly jobs.", color: "#a78bfa" },
            { icon: "📬", title: "Asynchronous", text: "Big files or long jobs wait in a queue. You collect results later.", color: "#f59e0b" },
            { icon: "💤", title: "Serverless", text: "For rare or spiky traffic. Scales to zero, but the first call can be slow.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "Choose based on how fast you need answers and how your traffic arrives.",
        "For rare, unpredictable traffic, serverless is usually cheapest. For huge offline jobs, batch is usually cheapest.",
        "SageMaker can serve a model four ways. **Real-time inference** answers in milliseconds from an always-on endpoint.",
        "**Serverless inference** scales to zero for spiky traffic. It takes only small payloads (up to 4 MB) and short requests (up to 60 seconds), and can have cold starts.",
        "**Asynchronous inference** queues large requests (up to 1 GB and up to one hour each) and writes results to S3. **Batch transform** scores a whole dataset offline. Bedrock also has **batch inference** for big jobs at a lower price.",
      ],
    },
    {
      id: "d1-metrics",
      check: ["d1-07", "d1-08"],
      task: "1.3",
      title: "Precision and recall: move the cutoff",
      visual: (
        <div className="grid gap-6">
          <ConfusionMatrix />
          <ThresholdLab />
        </div>
      ),
      points: [
        "The **F1 score** combines precision and recall into one number, so you can see the balance between them.",
        "Models that predict numbers are judged by how far off they are. Common measures are **RMSE**, **MAE** and **R²**.",
        "Business metrics show whether the model is worth it. Examples are return on investment, cost per user, development cost and customer feedback.",
        "A **confusion matrix** counts true positives, false positives, true negatives and false negatives. Precision, recall and F1 all come from it. **AUC**, the area under the ROC curve, sums up how well a model separates the classes.",
        "**Overfitting** means the model memorizes its training data and does badly on new data. **Underfitting** means it's too simple to learn the pattern. When one class is rare (**class imbalance**), accuracy alone can mislead.",
      ],
      tip: "Ask what's worse. If missing a sick patient is worse than a false alarm, you care most about **recall**. If annoying customers with false alarms is worse, you care most about **precision**.",
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
              { icon: "🏷️", title: "Supervised", text: "Every example has its answer attached.", color: "#38bdf8" },
              { icon: "🌗", title: "Semi-supervised", text: "A few labeled examples. The model labels the rest itself.", color: "#a78bfa" },
              { icon: "🔁", title: "Self-supervised", text: "The model makes its own labels, for example by guessing hidden words. This is how foundation models pre-train.", color: "#f59e0b" },
              { icon: "🫧", title: "Unsupervised", text: "No labels at all. The model looks for structure.", color: "#34d399" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🦶", title: "Learning rate", text: "How big each learning step is. Too high overshoots. Too low is slow." },
              { icon: "📦", title: "Batch size", text: "How many examples per update. Smaller batches are steadier but slower." },
              { icon: "🔄", title: "Epochs", text: "How many times the model reads all the data. Too many can overfit." },
              { icon: "🧷", title: "Regularization", text: "A penalty on complexity that helps stop overfitting." },
            ]}
          />
        </div>
      ),
      points: [
        "Start with **exploratory data analysis (EDA)**: statistics and charts that help you understand the data and spot problems before you build anything.",
        "**Feature engineering** turns raw data into useful inputs. For example, a date can become \"day of the week\". It applies to tables, text and images.",
        "A model that **overfits** has memorised its training data. Fix it with more or more varied data, stopping training early, better hyperparameter values, or combining several models.",
        "**Hyperparameters** are settings you pick before training. SageMaker Automatic Model Tuning tries different values and keeps the ones that score best on a metric you choose.",
        "**Edge inference** runs a small model right on the device. It's very fast and works offline. A big remote model is more capable but needs a network.",
        "Data services to know: **AWS Glue** runs serverless ETL jobs and keeps a data catalog. **AWS Glue DataBrew** cleans and prepares data visually, with no code. **Amazon EMR** runs Spark and Hadoop for big data.",
        "**Amazon Redshift** is a data warehouse for SQL analytics. **AWS Lake Formation** builds a data lake on S3 and controls who sees which tables, columns and rows. **AWS Data Exchange** lets you find and subscribe to third-party datasets.",
      ],
      tip: "If an answer says \"add more hyperparameters\" to fix overfitting, it's wrong. You change their values, you don't add new ones.",
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
            { icon: "💬", title: "Comprehend", text: "Finds people, places and dates out of the box. You can also train it on your own categories, or your own terms like policy numbers.", color: "#38bdf8" },
            { icon: "🎙️", title: "Transcribe", text: "Custom vocabularies teach it words like brand names. Custom language models teach it a whole field. It can also flag toxic speech.", color: "#a78bfa" },
            { icon: "🔊", title: "Polly", text: "Lexicons change how words are said (read AWS as 'Amazon Web Services'). SSML adds pauses and emphasis. Speech marks help with lip-sync.", color: "#f59e0b" },
            { icon: "🖼️", title: "Rekognition", text: "Custom Labels learns from a few hundred of your own images, like your logo. Tricky moderation cases can go to a human.", color: "#34d399" },
            { icon: "🎁", title: "Personalize", text: "Recipes for each kind of recommendation: items for a user, ranking, similar items, trending, next best action, user segments.", color: "#f87171" },
            { icon: "👥", title: "Mechanical Turk", text: "A crowd of human workers for simple jobs like labeling. Works with A2I and Ground Truth.", color: "#94a3b8" },
          ]}
        />
      ),
      points: [
        "The pre-built services work straight away. Most can also be tuned with your own data, without you building a model.",
        "There are medical versions for clinical speech and text: **Transcribe Medical** and **Comprehend Medical**.",
      ],
      tip: "If the service mishears certain words, add a custom vocabulary. If it misunderstands a whole field, like legal talk, use a custom language model.",
    },
    {
      id: "d1-sagemaker-tools",
      check: ["d1-61", "d1-63"],
      task: "1.3",
      title: "The SageMaker AI toolbox",
      visual: (
        <Flow
          loop="SageMaker Pipelines automates the whole loop, like CI/CD for ML"
          steps={[
            { icon: "🧹", label: "Prepare", sub: "Data Wrangler, Ground Truth, Feature Store" },
            { icon: "🧪", label: "Build and experiment", sub: "Studio, JumpStart, Canvas, MLflow tracking" },
            { icon: "🏋️", label: "Train and tune", sub: "Built-in algorithms, Automatic Model Tuning" },
            { icon: "📚", label: "Govern", sub: "Model Registry, Model Cards, Role Manager" },
            { icon: "📡", label: "Deploy and monitor", sub: "Endpoints, Model Monitor, Model Dashboard" },
          ]}
        />
      ),
      points: [
        "**Feature Store** keeps prepared inputs in one shared place, so teams can reuse them for both training and inference.",
        "**MLflow** on SageMaker tracks your experiments and runs. The **Model Registry** keeps each model version and records which one is approved.",
        "Built-in algorithms cover common jobs: linear models, KNN, k-means, PCA (for cutting down the number of features), anomaly detection and DeepAR for time-series forecasting.",
        "**Network isolation mode** runs training with no outbound internet access at all.",
        "**SageMaker Canvas** is no-code ML for business analysts. **SageMaker Model Monitor** watches deployed models for data and quality drift.",
      ],
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "aif-b1-01",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-what",
      prompt: "In machine learning, how does the computer learn to recognise dogs in photos?",
      options: [
        "It studies lots of example photos and works out the pattern",
        "A programmer writes a separate rule for every kind of dog there is",
        "It looks up the word dog online each time it sees a photo",
        "It stores every photo and asks a person to check each one",
      ],
      answer: [0],
      explanation:
        "Machine learning learns from examples instead of hand-written rules. Show it enough labeled photos and it picks up the pattern itself, the same way a child learns what a dog looks like.",
    },
    {
      id: "aif-b1-02",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-what",
      prompt: "Which statement about AI and machine learning is true?",
      options: [
        "Machine learning is one way of building AI",
        "AI is one small part of machine learning",
        "AI and machine learning mean exactly the same",
        "Machine learning works without using any data",
      ],
      answer: [0],
      explanation:
        "AI is the big umbrella for computers doing smart things. Machine learning sits under that umbrella: it's the approach where the system learns from data.",
    },
    {
      id: "aif-b1-03",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-train",
      prompt: "A finished model is now tagging new photos that customers upload. What is this phase called?",
      options: ["Inference", "Training", "Labeling", "Data collection"],
      answer: [0],
      explanation:
        "Using a finished model to answer new questions is called inference. Training is the earlier phase where the model learned from examples, like the driving lessons before you drive on your own.",
    },
    {
      id: "aif-b1-04",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-train",
      prompt: "What is training data?",
      options: [
        "The examples a model learns from",
        "The answers the model gives to users",
        "The computer the model runs on",
        "A list of rules written by hand",
      ],
      answer: [0],
      explanation:
        "Training data is the set of examples the model studies while it learns. Better and more varied examples usually lead to a better model.",
    },
    {
      id: "aif-b1-05",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-aws",
      prompt: "A small shop wants to turn its product descriptions into spoken audio and has nobody with ML skills. What's the easiest choice on AWS?",
      options: [
        "Use a pre-built AI service such as Amazon Polly",
        "Train a new speech model from scratch on SageMaker",
        "Hire a team to write the speech rules by hand",
        "Record a person reading each description aloud",
      ],
      answer: [0],
      explanation:
        "Pre-built services are like ordering from a menu: you send text and get speech back. Amazon Polly does exactly this, so nobody needs to build or train a model.",
    },
    {
      id: "aif-b1-06",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-aws",
      prompt: "When would you reach for Amazon SageMaker AI instead of a pre-built AI service?",
      options: [
        "When you need to build and train a model of your own",
        "When you only want to translate a few product sentences",
        "When you want text read aloud in a natural voice",
        "When you need to pull printed text out of scanned forms",
      ],
      answer: [0],
      explanation:
        "SageMaker AI is the kitchen where you cook your own dish. You use it when no ready-made service fits and you want to build, train and run your own model.",
    },

    // ── Exam questions ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-learning",
      prompt:
        "A retailer has years of transactions, each labeled 'fraud' or 'not fraud'. It wants to flag new fraudulent transactions. Which type of learning fits?",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Self-supervised learning"],
      answer: [0],
      explanation:
        "Every past transaction already has the right answer attached, fraud or not fraud. Learning from labeled examples to predict a category is supervised classification.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-learning",
      prompt:
        "A marketing team wants to group customers into segments, but nobody has defined the segments yet. Which technique should they use?",
      options: [
        "Linear regression on spend",
        "Clustering (unsupervised learning)",
        "Binary classification of buyers",
        "Reinforcement learning with rewards",
      ],
      answer: [1],
      explanation:
        "There are no labels to learn from, so the model has to find the groups itself. Grouping unlabeled data by similarity is clustering, an unsupervised technique. k-means is a common example.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-learning",
      prompt: "A robot learns to move around a warehouse. It gets a reward for reaching a target and a penalty for hitting things. What kind of learning is this?",
      options: [
        "Supervised learning",
        "Unsupervised learning",
        "Reinforcement learning",
        "Self-supervised learning",
      ],
      answer: [2],
      explanation:
        "Learning by trial and error, with rewards and penalties from its surroundings, is reinforcement learning. AWS DeepRacer, a small self-driving race car, is the classic AWS example.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "Which statement best describes how AI, ML and deep learning relate to each other?",
      options: [
        "Deep learning is a subset of ML, which is a subset of AI",
        "AI is a subset of ML, which is a subset of deep learning",
        "ML and deep learning are unrelated fields within AI",
        "Deep learning is a subset of AI but not of ML",
      ],
      answer: [0],
      explanation:
        "Picture rings inside rings. AI is the outer ring. ML is the part of AI that learns from data. Deep learning is the part of ML that uses neural networks with many layers.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "A model scores 99% accuracy on its training data but only 62% on new data. What's the most likely problem?",
      options: ["Underfitting", "Overfitting", "Data drift", "Low latency"],
      answer: [1],
      explanation:
        "The model did brilliantly on data it had seen and badly on data it hadn't. That's overfitting: it memorised the training examples, noise included. More data, regularization or a simpler model can help.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "A model does badly on both its training data and its test data. What is this called?",
      options: ["Overfitting", "Underfitting", "High variance", "Concept drift"],
      answer: [1],
      explanation:
        "Underfitting, also called high bias, means the model is too simple to catch the pattern at all. Try more useful features, a more complex model, or longer training.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "In a cancer screening model, missing a real positive case is very costly. Which metric should you focus on?",
      options: ["Precision", "Recall", "Accuracy", "RMSE"],
      answer: [1],
      explanation:
        "Recall is true positives divided by all real positives, TP / (TP + FN). It tells you how many of the real cases you caught, so it's the one to watch when a miss is expensive.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "A spam filter must not send real emails to the spam folder. Which metric matters most?",
      options: ["Recall", "Precision", "R-squared", "Perplexity"],
      answer: [1],
      explanation:
        "Precision is true positives divided by everything you flagged, TP / (TP + FP). High precision means few false alarms, so good emails rarely end up marked as spam.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which metric combines precision and recall into a single number?",
      options: ["F1 score", "AUC", "Mean absolute error", "BLEU"],
      answer: [0],
      explanation: "The F1 score is the harmonic mean of precision and recall. It's handy when one class is much rarer than the other.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which metrics would you use to judge a model that predicts house prices? (Choose two.)",
      options: ["Root mean squared error", "F1 score", "Mean absolute error (MAE)", "Recall"],
      answer: [0, 2],
      explanation:
        "A house price is a number, so you measure how far off the predictions are. RMSE, MAE and R-squared do that. F1 and recall are for models that predict categories.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A company wants to find objects and faces in images without building a model. Which AWS service should it use?",
      options: [
        "Amazon Comprehend",
        "Amazon Rekognition",
        "Amazon Textract",
        "Amazon SageMaker AI",
      ],
      answer: [1],
      explanation:
        "Amazon Rekognition is the ready-made computer vision service for images and video. It finds objects, faces and labels, and can spot unsafe content.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A bank wants to pull fields and tables out of scanned loan application forms. Which service fits best?",
      options: ["Amazon Textract", "Amazon Comprehend", "Amazon Rekognition", "Amazon Translate"],
      answer: [0],
      explanation:
        "Amazon Textract does more than read the text. It understands forms, so it can pull out fields like 'Name: Jane' and whole tables from scanned documents.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A support team wants to find the mood and main phrases in thousands of customer reviews. Which service should they use?",
      options: ["Amazon Transcribe", "Amazon Lex", "Amazon Comprehend", "Amazon Rekognition"],
      answer: [2],
      explanation:
        "Amazon Comprehend is the language service for text. It finds sentiment, names, key phrases, which language is used, and personal data.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A call center needs to turn recorded calls into text so it can analyse them. Which service?",
      options: [
        "Amazon Polly",
        "Amazon Transcribe",
        "Amazon Translate",
        "Amazon Comprehend",
      ],
      answer: [1],
      explanation:
        "Amazon Transcribe turns speech into text. Amazon Polly does the reverse, turning text into speech. Transcribe Call Analytics adds extra insights made for phone calls.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-services",
      prompt: "Which service lets you build chatbots that understand voice and text, using the same technology as Alexa?",
      options: ["Amazon Lex", "Amazon Transcribe", "Amazon Polly", "Amazon Personalize"],
      answer: [0],
      explanation: "Amazon Lex builds conversational bots. It combines speech recognition with language understanding, so the bot can work out what the person wants.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-services",
      prompt: "An online store wants real-time product recommendations based on what each shopper does, with no ML expertise. Which service?",
      options: ["Amazon Forecast", "Amazon Personalize", "Amazon Comprehend", "Amazon Fraud Detector"],
      answer: [1],
      explanation: "Amazon Personalize is a managed recommendation service built on the same technology Amazon.com uses. You give it user activity and it suggests items.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "What's the right order for the core ML development lifecycle?",
      options: [
        "Collect data, train and evaluate, define the problem, deploy, then monitor",
        "Define the problem, collect and prepare data, train and evaluate, deploy, monitor",
        "Define the problem, train and evaluate, collect and prepare data, monitor, then deploy",
        "Collect and prepare data, deploy, train and evaluate, define the problem",
      ],
      answer: [1],
      explanation:
        "You start by deciding the business goal and framing the problem. Then come data collection and preparation, including feature engineering, followed by training, evaluation, deployment and monitoring.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Which SageMaker feature notices when a deployed model's input data or prediction quality drifts over time?",
      options: [
        "SageMaker Clarify",
        "SageMaker Model Monitor",
        "SageMaker Ground Truth",
        "SageMaker Model Registry",
      ],
      answer: [1],
      explanation:
        "SageMaker Model Monitor keeps watching models in production. It flags drift in the data, in model quality, in bias and in which features drive the predictions.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A team needs people to label thousands of images to build a training dataset. Which service helps?",
      options: ["SageMaker Ground Truth", "SageMaker Data Wrangler", "Amazon Rekognition", "SageMaker Feature Store"],
      answer: [0],
      explanation:
        "SageMaker Ground Truth manages labeling jobs done by people: your own team, a vendor, or Mechanical Turk. It can also use active learning to label the easy items automatically.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Business analysts who can't code want to build ML predictions with a visual, point-and-click tool. Which tool fits?",
      options: ["SageMaker Studio notebooks", "SageMaker Canvas", "AWS Glue", "Amazon EMR"],
      answer: [1],
      explanation: "SageMaker Canvas is the no-code ML tool made for business analysts. You point, click and get predictions without writing code.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-inference",
      prompt:
        "A company needs predictions for millions of records once a night and doesn't need instant answers. Which inference type is most cost-effective?",
      options: ["Real-time inference", "Batch transform", "Serverless inference", "Asynchronous inference"],
      answer: [1],
      explanation:
        "Batch transform scores a large dataset offline, with no endpoint left running. Real-time is for instant answers, serverless for occasional traffic, and asynchronous for big files or long jobs.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "When is AI or ML a poor fit for a problem?",
      options: [
        "When the outcome must be exactly determined by simple, fixed rules",
        "When there are years of labeled historical data for the model to learn from",
        "When the patterns are too complex to write down as rules by hand",
        "When predictions have to scale to millions of users each day",
      ],
      answer: [0],
      explanation:
        "If a simple rule or calculation already gives the exact answer, ML only adds cost and uncertainty. ML is worth it when the rules are too hard to write down.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "What is a hyperparameter?",
      options: [
        "A value the model learns from the data during training, such as a weight",
        "A setting chosen before training that controls how the model learns",
        "The prediction a trained model returns for a new input record",
        "A label attached to each example in the training dataset",
      ],
      answer: [1],
      explanation:
        "Hyperparameters, like learning rate, epochs and batch size, are settings you choose before training starts. Parameters, like weights, are what the model learns. SageMaker Automatic Model Tuning can search for good hyperparameter values for you.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What best describes agentic AI?",
      options: [
        "AI that plans steps, uses tools and takes actions toward a goal",
        "AI that generates images or video from a short text description",
        "A rules engine that follows fixed if/then logic written by people",
        "A model that answers one question at a time with no tools at all",
      ],
      answer: [0],
      explanation:
        "Generative AI creates content when you ask. Agentic AI goes further: it breaks a goal into steps, calls tools or APIs, checks the results and keeps going until the job is done.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-inference",
      prompt: "A model has to process large video files that take several minutes each, and callers don't need an instant reply. Which SageMaker AI inference option fits?",
      options: [
        "Asynchronous inference",
        "Real-time inference endpoint",
        "Batch transform jobs",
        "Serverless inference",
      ],
      answer: [0],
      explanation:
        "Asynchronous inference puts large or slow requests in a queue and tells you when the result is ready. It can also scale down to zero when nothing is waiting.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-inference",
      prompt: "A model gets only a few requests a day, at random times. The team wants to pay nothing while it sits idle. Which inference option fits?",
      options: ["Serverless inference", "Real-time inference on a large instance", "Batch transform", "A dedicated GPU cluster"],
      answer: [0],
      explanation: "Serverless inference starts computing power only when a request arrives and scales to zero in between. Occasional traffic costs very little, though the first request after a quiet spell can be slower.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-learning",
      type: "match",
      prompt: "Match each example to its type of data.",
      pairs: [
        ["Hourly temperature readings for a year", "Time-series data"],
        ["A spreadsheet of customers with columns", "Structured (tabular) data"],
        ["Customer support emails", "Unstructured text data"],
        ["Photos tagged 'cat' or 'dog'", "Labeled image data"],
      ],
      explanation:
        "Time-series data is ordered by time. Tabular data has rows and columns. Free text has no fixed shape, so it's unstructured. The cat or dog tags are labels, which is what supervised learning needs.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-techniques",
      type: "match",
      prompt: "Match each business problem to the ML technique that solves it.",
      pairs: [
        ["Predict next month's sales in dollars", "Regression"],
        ["Decide if an email is spam or not", "Classification"],
        ["Group shoppers with similar habits, no labels", "Clustering"],
      ],
      explanation: "Regression predicts a number. Classification predicts a category. Clustering finds groups in data that has no labels.",
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
        "You start from the business problem, then the data, then training and evaluation, then deployment. Monitoring catches drift and leads to re-training, which starts the loop again.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-techniques",
      prompt:
        "A bank must explain every credit decision to regulators and has years of clean data in tables. Which approach usually fits best?",
      options: [
        "A traditional, interpretable model such as a decision tree",
        "A large multimodal foundation model fine-tuned on the tables",
        "An image generation model trained on scanned statements",
        "A chatbot that writes each decision at high temperature",
      ],
      answer: [0],
      explanation:
        "When the rules demand clear explanations and the data is structured, a traditional model you can inspect is often the better choice. Foundation models are better for open-ended work with text, images and other unstructured data.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Which of these are core MLOps practices? (Choose two.)",
      options: [
        "Monitoring models in production and re-training when performance drops",
        "Making experiments repeatable and pipelines automated",
        "Training once and never updating the model",
        "Keeping model versions only on a laptop",
        "Skipping evaluation to ship faster",
      ],
      answer: [0, 1],
      explanation: "MLOps brings good software habits to ML. That means tracked, repeatable experiments, automated pipelines, systems that scale, monitoring in production and re-training when needed.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A startup wants to use a foundation model without looking after any servers or GPUs. Which way of using the model fits best?",
      options: [
        "Call it through a managed API such as Amazon Bedrock",
        "Self-host it on Amazon EC2 GPU instances that you manage",
        "Train a new model from scratch on SageMaker AI",
        "Run it on a fleet of employee laptops overnight",
      ],
      answer: [0],
      explanation:
        "With a managed API, AWS runs the machines and you pay for what you use. Hosting it yourself gives more control, but then scaling, patching and cost are your problem.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Which of these is a BUSINESS metric for judging an ML solution, rather than a model metric?",
      options: [
        "Return on investment (ROI)",
        "F1 score on the held-out test set",
        "Recall on the fraud class",
        "Precision on the test set",
      ],
      answer: [0],
      explanation: "Model metrics like accuracy, precision, recall and F1 tell you how good the predictions are. Business metrics like ROI, cost per user, customer feedback and development cost tell you whether it's worth the money.",
    },
    // ── Practice set 2 ──
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "An insurer wants to predict the dollar amount of each new claim, based on past claims. Which ML technique fits?",
      options: ["Regression", "Binary classification", "Clustering", "Dimensionality reduction"],
      answer: [0],
      explanation: "The answer is a number that can be anything in a range, a dollar amount. Predicting a number like that is regression.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-learning",
      prompt: "A security team wants to spot unusual network traffic, but it has no labeled examples of attacks. Which approach fits best?",
      options: [
        "Unsupervised anomaly detection",
        "Supervised classification of attacks",
        "Reinforcement learning agent",
        "Linear regression on traffic",
      ],
      answer: [0],
      explanation: "Without labels, you can't teach the model what an attack looks like. Unsupervised methods learn what normal traffic looks like instead, then flag anything that doesn't fit.",
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
      explanation: "Audio, images, video and free text have no fixed layout of rows and columns, so they're unstructured. Tables and CSV files with set columns are structured.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What does inference mean in machine learning?",
      options: [
        "Using a trained model to make predictions on new data",
        "Collecting and cleaning the data used for training",
        "Labeling images by hand so a model can learn from them",
        "Choosing which algorithm and settings to train with",
      ],
      answer: [0],
      explanation: "Training is when the model learns. Inference is when you use the trained model to get predictions or outputs for new data.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "A team turns a raw timestamp into new inputs such as 'day of week' and 'is holiday' to help a model learn. What is this called?",
      options: ["Feature engineering", "Hyperparameter tuning", "Model deployment", "Inference"],
      answer: [0],
      explanation: "Feature engineering reshapes raw data into inputs, called features, that make patterns easier to see. A bare timestamp says little, but 'is it a holiday?' can say a lot about sales.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-metrics",
      prompt:
        "Only 1% of transactions are fraud. A model that labels everything 'not fraud' scores 99% accuracy. What's the problem?",
      options: [
        "Class imbalance makes accuracy misleading; use precision, recall or F1",
        "The model is underfitting, because its accuracy is far too high to be real",
        "The data has too many features, so accuracy can't be trusted",
        "Accuracy is the right metric here, so the model is ready to ship",
      ],
      answer: [0],
      explanation: "When one class is rare, accuracy can look great while the model catches nothing. This model finds zero fraud, and recall and F1 would show that straight away.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Why do you keep back a test dataset that the model never sees during training?",
      options: [
        "To estimate how the model will perform on new, unseen data",
        "To give the model extra examples to learn from in training",
        "To choose the learning rate while the model is training",
        "To keep a backup copy of the data in case training fails",
      ],
      answer: [0],
      explanation: "A held-back test set works like a surprise exam. It gives an honest idea of how the model will do in the real world. A separate validation set is used for tuning along the way.",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-services",
      prompt: "A company must find and hide names, addresses and phone numbers in thousands of written support tickets. Which service fits?",
      options: ["Amazon Comprehend", "Amazon Polly", "Amazon Rekognition", "Amazon Translate"],
      answer: [0],
      explanation: "Amazon Comprehend can find personally identifiable information (PII), like names and phone numbers, in text and redact it for you.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "Data scientists want a visual tool to clean, transform and explore training data with little code. Which SageMaker AI feature fits?",
      options: ["SageMaker Data Wrangler", "SageMaker Model Monitor", "Amazon Lex", "AWS CloudTrail"],
      answer: [0],
      explanation: "SageMaker Data Wrangler helps you bring in data, prepare it and chart it for ML, with very little code.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-lifecycle",
      prompt: "An MLOps team needs one place to list model versions and track which version is approved for production. Which feature fits?",
      options: [
        "SageMaker Model Registry",
        "SageMaker Model Monitor",
        "SageMaker Ground Truth",
        "SageMaker Feature Store groups",
      ],
      answer: [0],
      explanation: "The Model Registry keeps every model version with its details and approval status. That makes deployments repeatable and easy to audit.",
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
      explanation: "Labeled data comes first. You train on one part, test on data the model hasn't seen, and only deploy once it's good enough.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-techniques",
      type: "match",
      prompt: "Match each kind of AI application to an example of it.",
      pairs: [
        ["Computer vision", "Reading license plates from camera footage"],
        ["Natural language processing", "Detecting the intent of support emails"],
        ["Speech recognition", "Turning a voicemail into text"],
        ["Recommendation system", "Suggesting products from browsing history"],
        ["Forecasting", "Predicting next quarter's inventory demand"],
      ],
      explanation: "Vision works with images. Language processing works with text. Speech recognition works with audio. Recommenders learn from behaviour, and forecasting predicts from data over time.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-services",
      type: "match",
      prompt: "Match each AWS service to the job it does best.",
      pairs: [
        ["Amazon Translate", "Localise a website into Spanish"],
        ["Amazon Polly", "Read news articles aloud"],
        ["Amazon Textract", "Pull totals from scanned invoices"],
        ["Amazon Lex", "Build a voice bot that books appointments"],
        ["Amazon Personalize", "Recommend movies to each viewer"],
      ],
      explanation: "Each of these is a ready-made AI service you call through an API. You don't train any model yourself.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-techniques",
      prompt: "Which of these are realistic business benefits of AI and ML? (Choose two.)",
      options: [
        "Automating repetitive tasks at scale",
        "Supporting faster, better-informed human decisions",
        "Guaranteeing every output is correct",
        "Removing the need for any data",
        "Eliminating all operating costs",
      ],
      answer: [0, 1],
      explanation: "AI earns its keep through automation, scale and helping people decide. It never guarantees a correct answer, and it always needs data.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-rings",
      prompt: "What is a neural network?",
      options: [
        "Layers of connected nodes whose weights are learned from data",
        "A database of if/then rules written and updated by subject experts",
        "A chain of decision trees that each vote on the answer",
        "A table of averages computed from the training data",
      ],
      answer: [0],
      explanation: "A neural network passes data through layers of small connected units. Training adjusts the strength of each connection, called a weight. Deep learning just means using many layers.",
    },
    // ── Practice set 3 ──
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A team has 500 labeled images and 50,000 unlabeled ones. The model learns from the labeled set, labels the rest itself, then retrains on everything. What is this?",
      options: [
        "Semi-supervised learning",
        "Reinforcement learning",
        "Unsupervised clustering",
        "Transfer learning with fine-tuning",
      ],
      answer: [0],
      explanation: "Semi-supervised learning mixes a small amount of labeled data with a lot of unlabeled data. The labels the model makes for itself are called pseudo-labels.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "How are large language models usually pre-trained on huge amounts of text without human labels?",
      options: [
        "Self-supervised learning: it predicts words hidden from the text",
        "Supervised learning on sentences labeled one by one by human annotators",
        "Reinforcement learning with rewards from human reviewers",
        "Unsupervised clustering of documents into similar topics",
      ],
      answer: [0],
      explanation: "In self-supervised learning the data provides its own answers. The model hides a word, or the next word, and practises guessing it. No person has to label anything.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Before building a model, a data scientist charts distributions and correlations to understand the data and find problems. Which phase is this?",
      options: [
        "Exploratory data analysis (EDA)",
        "Model deployment and monitoring",
        "Hyperparameter tuning jobs",
        "Inference on a test endpoint",
      ],
      answer: [0],
      explanation: "Exploratory data analysis uses statistics and charts to check data quality, patterns and relationships before any modeling starts.",
    },
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Training loss jumps around and never settles down. Which hyperparameter is the most likely cause?",
      options: ["The learning rate is too high", "The test set is too large", "The number of features is too small", "The model is deployed in the wrong Region"],
      answer: [0],
      explanation: "A high learning rate means big steps, so the model keeps overshooting the best spot. A lower rate settles more precisely, but takes longer.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A model is overfitting. Which actions help? (Choose two.)",
      options: ["Use more, or more varied, training data (including data augmentation)", "Stop training early", "Add more hyperparameters", "Train for many more epochs", "Remove the validation set"],
      answer: [0, 1],
      explanation: "More varied data and stopping training early both reduce overfitting. You change hyperparameter values rather than add new ones, and extra epochs usually make overfitting worse.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "Which hyperparameter controls how many times the model goes through the whole training dataset?",
      options: [
        "Number of epochs",
        "Batch size",
        "Learning rate",
        "Number of layers",
      ],
      answer: [0],
      explanation: "One epoch is one full pass over the training data. Too few epochs can leave the model underfit. Too many can make it overfit.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-data-tuning",
      prompt: "A factory needs AI predictions on machines with patchy internet, and the answers must come back almost instantly. What fits best?",
      options: [
        "A small model running on the edge device",
        "A large model called over the internet each time",
        "A batch transform job run every night",
        "A bigger context window on the model",
      ],
      answer: [0],
      explanation: "Running a small model right on the device, called edge inference, is very fast and works offline. The trade-off is that a small model is less capable than a big one.",
    },
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-metrics",
      prompt: "Two classifiers are compared across every possible cutoff. Model A has an AUC-ROC of 0.89 and model B has 0.52. What does this tell you?",
      options: [
        "Model A separates the classes much better; B is close to random",
        "Model B is more accurate, because a lower AUC means fewer errors",
        "Both models are equally good, since both are above 0.5",
        "Model A is overfitting, so model B will do better in production",
      ],
      answer: [0],
      explanation: "AUC-ROC runs from 0 to 1. A score around 0.5 is no better than flipping a coin, and the closer to 1, the better the model tells the classes apart.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "Amazon Transcribe keeps mishearing your product names and acronyms. What's the quickest fix?",
      options: ["Add a custom vocabulary", "Switch to Amazon Polly", "Raise the temperature", "Use Amazon Translate first"],
      answer: [0],
      explanation: "A custom vocabulary teaches Transcribe your specific words and phrases. A custom language model is for when it misunderstands the context of a whole field.",
    },
    {
      id: "d1-58",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "A company wants Amazon Polly to always read \"AWS\" as \"Amazon Web Services\". Which feature does this?",
      options: ["Lexicons", "Speech marks", "Custom Labels", "Toxicity detection"],
      answer: [0],
      explanation: "A lexicon tells Polly how to say particular words. SSML adds pauses and emphasis, and speech marks record where each word starts and ends, which helps with lip-sync.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "A brand wants to find its own logo in social media photos. Which service and feature fit?",
      options: ["Amazon Rekognition Custom Labels", "Amazon Comprehend custom classification", "Amazon Textract", "Amazon Lex"],
      answer: [0],
      explanation: "Custom Labels trains on a modest set of your own labeled images, so Rekognition can spot things that are specific to you, like your logo.",
    },
    {
      id: "d1-60",
      domain: "d1",
      lesson: "d1-services-custom",
      prompt: "An insurer wants to pull policy numbers out of customer emails. Which Amazon Comprehend capability fits?",
      options: ["Custom entity recognition", "Sentiment analysis", "Language detection", "Built-in key phrases only"],
      answer: [0],
      explanation: "Custom entity recognition finds terms that only matter to your business, like policy numbers. Custom classification is different: it sorts whole documents into categories you define.",
    },
    {
      id: "d1-61",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "A team wants every model built, trained, tested and deployed through an automated, repeatable workflow. Which SageMaker AI feature fits?",
      options: ["SageMaker Pipelines", "SageMaker Canvas", "Amazon Polly", "SageMaker Ground Truth"],
      answer: [0],
      explanation: "SageMaker Pipelines is like CI/CD for ML. It turns the steps into an automated workflow, so there are fewer manual steps and fewer mistakes.",
    },
    {
      id: "d1-62",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "Data scientists want one place to store prepared features so other teams can reuse them for training and inference. Which feature fits?",
      options: ["SageMaker Feature Store", "SageMaker Model Monitor", "AWS Artifact", "SageMaker JumpStart"],
      answer: [0],
      explanation: "Feature Store keeps features in one central place. Data Wrangler can send features into it, and other teams can find them in SageMaker Studio.",
    },
    {
      id: "d1-63",
      domain: "d1",
      lesson: "d1-sagemaker-tools",
      prompt: "An ML team already tracks experiments with open-source MLflow and wants it managed inside SageMaker. What should they use?",
      options: [
        "MLflow tracking servers on Amazon SageMaker AI",
        "SageMaker Model Monitor with a data baseline",
        "Amazon CloudWatch dashboards for each training job",
        "SageMaker Ground Truth with a private workforce",
      ],
      answer: [0],
      explanation: "SageMaker can run managed MLflow tracking servers for you. They work with SageMaker Studio and keep a record of your runs and experiments.",
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
      explanation: "Built-in algorithms let you train common kinds of model without writing the algorithm yourself.",
    },

    // ── Added: AIF-C01 coverage gaps ──
    {
      "id": "d1-65",
      "domain": "d1",
      "lesson": "d1-sagemaker-tools",
      "prompt": "Several teams keep rebuilding the same customer features for their models. Which SageMaker feature lets them store and share features?",
      "options": [
        "SageMaker Feature Store",
        "SageMaker Model Registry",
        "SageMaker Debugger",
        "SageMaker Neo"
      ],
      "answer": [
        0
      ],
      "explanation": "Feature Store keeps features in one place, for training and for low-latency lookup at inference time, so teams reuse them."
    },
    {
      "id": "d1-66",
      "domain": "d1",
      "lesson": "d1-sagemaker-tools",
      "prompt": "Feature Store has an online store and an offline store. What is the online store for?",
      "options": [
        "Fast lookups when the model makes live predictions",
        "Long-term offline history for building new training datasets",
        "Saving trained model files for later",
        "Holding the logs of each training job"
      ],
      "answer": [
        0
      ],
      "explanation": "The online store gives low-latency reads for real-time inference. The offline store keeps history for training."
    },
    {
      "id": "d1-67",
      "domain": "d1",
      "lesson": "d1-sagemaker-tools",
      "type": "match",
      "prompt": "Match each SageMaker feature to its job.",
      "pairs": [
        [
          "Feature Store",
          "Store and share ML features"
        ],
        [
          "Model Registry",
          "Track and approve model versions"
        ],
        [
          "Model Monitor",
          "Watch live models for drift"
        ],
        [
          "Ground Truth",
          "Label training data"
        ]
      ],
      "explanation": "These tools cover the ML lifecycle from data to production."
    },
    {
      "id": "d1-68",
      "domain": "d1",
      "lesson": "d1-services",
      "prompt": "Which AWS service pulls text, forms and tables out of scanned documents?",
      "options": [
        "Amazon Textract",
        "Amazon Comprehend",
        "Amazon Translate",
        "Amazon Polly"
      ],
      "answer": [
        0
      ],
      "explanation": "Textract reads documents. Comprehend then finds meaning in text, such as sentiment or entities."
    },
    {
      "id": "d1-69",
      "domain": "d1",
      "lesson": "d1-services",
      "prompt": "A company wants staff to search internal documents by asking questions in plain English. Which service is built for this?",
      "options": [
        "Amazon Kendra",
        "Amazon Personalize",
        "Amazon Forecast",
        "Amazon Lex"
      ],
      "answer": [
        0
      ],
      "explanation": "Kendra is an intelligent search service that understands natural language questions. Kendra is closed to new customers, but still in the exam guide."
    },
    {
      "id": "d1-70",
      "domain": "d1",
      "lesson": "d1-services",
      "prompt": "Which AWS AI services work with speech? (Choose two.)",
      "options": [
        "Amazon Transcribe",
        "Amazon Polly",
        "Amazon Rekognition",
        "Amazon Textract",
        "Amazon Forecast"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Transcribe turns speech into text and Polly turns text into speech."
    },
    {
      "id": "d1-71",
      "domain": "d1",
      "lesson": "d1-lifecycle",
      "type": "order",
      "prompt": "Put the ML pipeline steps in order.",
      "items": [
        "Collect data",
        "Prepare data and features",
        "Train the model",
        "Evaluate the model",
        "Deploy and monitor"
      ],
      "explanation": "Each step feeds the next, and monitoring often sends you back to collect better data."
    },
    {
      "id": "d1-72",
      "domain": "d1",
      "lesson": "d1-metrics",
      "prompt": "A fraud model must catch as many real fraud cases as possible, even with some false alarms. Which metric matters most?",
      "options": [
        "Recall",
        "Precision",
        "Mean absolute error",
        "R squared"
      ],
      "answer": [
        0
      ],
      "explanation": "Recall measures how many real positives you caught. Precision measures how many alarms were real."
    },
    {
      "id": "d1-73",
      "domain": "d1",
      "lesson": "d1-inference",
      "prompt": "A model scores a whole day's transactions once each night. Which inference type fits?",
      "options": [
        "Batch inference",
        "Real-time inference",
        "Serverless streaming",
        "Edge inference"
      ],
      "answer": [
        0
      ],
      "explanation": "When nobody waits for the answer, batch inference is simpler and cheaper."
    },
    {
      "id": "d1-74",
      "domain": "d1",
      "lesson": "d1-learning",
      "prompt": "Which learning type finds groups in data that has no labels?",
      "options": [
        "Unsupervised learning",
        "Supervised learning",
        "Reinforcement learning",
        "Transfer learning"
      ],
      "answer": [
        0
      ],
      "explanation": "Unsupervised learning, like clustering, finds patterns without labels."
    },

    // ── Added: AIF-C01 exam-style practice ──
    {
      "id": "d1-75",
      "domain": "d1",
      "lesson": "d1-data-tuning",
      "prompt": "A data scientist wants a model to predict better without collecting more data. Which actions help most? (Choose two.)",
      "options": [
        "Create new input features from the existing columns",
        "Tune hyperparameters such as the learning rate",
        "Move the training data to a cheaper S3 storage class",
        "Copy the dataset to an S3 bucket in another Region",
        "Turn on S3 versioning for the training dataset"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Feature engineering gives the model more useful signals, and hyperparameter tuning finds better training settings. Storage class, Region and versioning change cost or safety, not accuracy."
    },
    {
      "id": "d1-76",
      "domain": "d1",
      "lesson": "d1-metrics",
      "prompt": "A fraud model's test results are shown as counts of true positives, false positives, true negatives and false negatives. What is this table called?",
      "options": [
        "A confusion matrix",
        "A correlation heatmap",
        "A learning curve",
        "A feature importance chart"
      ],
      "answer": [
        0
      ],
      "explanation": "A confusion matrix counts right and wrong predictions for each class. Precision, recall and F1 are all worked out from it."
    },
    {
      "id": "d1-77",
      "domain": "d1",
      "lesson": "d1-metrics",
      "prompt": "A model predicts delivery times in minutes. Which metric reports the typical error size in minutes, the same unit as the target?",
      "options": [
        "Root mean squared error",
        "F1 score",
        "Area under the ROC curve",
        "Precision"
      ],
      "answer": [
        0
      ],
      "explanation": "RMSE is a regression metric in the same unit as the target. F1, AUC and precision are for classification."
    },
    {
      "id": "d1-78",
      "domain": "d1",
      "lesson": "d1-data-tuning",
      "type": "match",
      "prompt": "Match each AWS data service to its job.",
      "pairs": [
        [
          "AWS Glue",
          "Serverless ETL and a data catalog"
        ],
        [
          "AWS Glue DataBrew",
          "Visual data prep without code"
        ],
        [
          "Amazon EMR",
          "Managed Spark and Hadoop for big data"
        ],
        [
          "AWS Lake Formation",
          "Fine-grained access to a data lake"
        ],
        [
          "Amazon Redshift",
          "Data warehouse for SQL analytics"
        ]
      ],
      "explanation": "These services prepare and store the data that ML models train on."
    },
    {
      "id": "d1-79",
      "domain": "d1",
      "lesson": "d1-data-tuning",
      "prompt": "A team needs third-party weather data to improve a demand forecast. Which AWS service lets them find and subscribe to datasets from outside providers?",
      "options": [
        "AWS Data Exchange",
        "AWS Glue DataBrew",
        "Amazon Kinesis",
        "AWS DataSync"
      ],
      "answer": [
        0
      ],
      "explanation": "AWS Data Exchange is a catalog of third-party data you can subscribe to and use in AWS. DataBrew cleans data you already have."
    },
    {
      "id": "d1-80",
      "domain": "d1",
      "lesson": "d1-lifecycle",
      "type": "order",
      "prompt": "A live model's results start to slip. Put the MLOps steps that fix it in order.",
      "items": [
        "Model Monitor detects drift in production",
        "Collect and label fresh data",
        "Re-train the model",
        "Register and approve the new version",
        "Redeploy the model"
      ],
      "explanation": "Monitoring spots the drift first. You then gather newer data, re-train, approve the new version in Model Registry and redeploy it. Running this loop well is MLOps."
    },
    {
      "id": "d1-81",
      "domain": "d1",
      "lesson": "d1-inference",
      "prompt": "A model scores documents up to 500 MB, and each request can take 20 minutes. Callers don't need an instant answer. Which SageMaker inference option fits?",
      "options": [
        "Asynchronous inference",
        "Real-time inference",
        "Serverless inference",
        "A multi-model real-time endpoint"
      ],
      "answer": [
        0
      ],
      "explanation": "Asynchronous inference queues requests, takes payloads up to 1 GB, runs up to one hour, and can scale to zero. Serverless inference is limited to small payloads and short requests."
    },
    {
      "id": "d1-82",
      "domain": "d1",
      "lesson": "d1-sagemaker-tools",
      "prompt": "A business analyst with no coding skills wants to build a churn prediction model from a spreadsheet. Which option fits?",
      "options": [
        "SageMaker Canvas",
        "SageMaker Studio notebooks",
        "SageMaker Debugger",
        "SageMaker Neo"
      ],
      "answer": [
        0
      ],
      "explanation": "SageMaker Canvas is a no-code, point-and-click way to build models. Studio notebooks need code."
    },
  ],

  cards: [
    { id: "s-sagemaker", domain: "d1", kind: "service", term: "Amazon SageMaker AI", definition: "Build, train and deploy your own ML models from start to finish" },
    { id: "s-canvas", domain: "d1", kind: "service", term: "SageMaker Canvas", definition: "Point-and-click ML predictions for business analysts, no code needed" },
    { id: "s-monitor", domain: "d1", kind: "service", term: "SageMaker Model Monitor", definition: "Spots data drift and falling model quality in production" },
    { id: "s-groundtruth", domain: "d1", kind: "service", term: "SageMaker Ground Truth", definition: "People label your data to build training datasets" },
    { id: "s-rekognition", domain: "d1", kind: "service", term: "Amazon Rekognition", definition: "Analyses images and video: objects, faces and unsafe content" },
    { id: "s-comprehend", domain: "d1", kind: "service", term: "Amazon Comprehend", definition: "Understands text: sentiment, names, key phrases and personal data" },
    { id: "s-textract", domain: "d1", kind: "service", term: "Amazon Textract", definition: "Pulls text, form fields and tables out of scanned documents" },
    { id: "s-transcribe", domain: "d1", kind: "service", term: "Amazon Transcribe", definition: "Turns speech into text" },
    { id: "s-polly", domain: "d1", kind: "service", term: "Amazon Polly", definition: "Turns text into natural-sounding speech" },
    { id: "s-translate", domain: "d1", kind: "service", term: "Amazon Translate", definition: "Translates text between languages" },
    { id: "s-lex", domain: "d1", kind: "service", term: "Amazon Lex", definition: "Builds chatbots and voice bots" },
    { id: "s-personalize", domain: "d1", kind: "service", term: "Amazon Personalize", definition: "Real-time recommendations for each user" },
    { id: "c-agentic", domain: "d1", kind: "concept", term: "Agentic AI", definition: "AI that plans steps, uses tools and takes actions toward a goal" },
    { id: "c-async", domain: "d1", kind: "concept", term: "Asynchronous inference", definition: "Big or slow requests wait in a queue and you collect results later" },
    { id: "c-serverless", domain: "d1", kind: "concept", term: "Serverless inference", definition: "Computing power on demand that scales to zero, for spiky traffic" },
    { id: "c-batch", domain: "d1", kind: "concept", term: "Batch transform", definition: "Offline predictions over a whole dataset, with no endpoint running" },
    { id: "c-overfit", domain: "d1", kind: "concept", term: "Overfitting", definition: "Great on training data, poor on new data: the model memorised" },
    { id: "c-underfit", domain: "d1", kind: "concept", term: "Underfitting", definition: "Poor on both training and new data: the model is too simple" },
    { id: "c-precision", domain: "d1", kind: "concept", term: "Precision", definition: "TP / (TP + FP): of everything you flagged, how much was real" },
    { id: "c-recall", domain: "d1", kind: "concept", term: "Recall", definition: "TP / (TP + FN): of all the real cases, how many you caught" },
    { id: "c-f1", domain: "d1", kind: "concept", term: "F1 score", definition: "One number that balances precision and recall (their harmonic mean)" },
    { id: "c-semisup", domain: "d1", kind: "concept", term: "Semi-supervised learning", definition: "A little labeled data plus lots of unlabeled data the model labels itself" },
    { id: "c-eda", domain: "d1", kind: "concept", term: "Exploratory data analysis", definition: "Statistics and charts to understand the data before modeling" },
    { id: "c-lr", domain: "d1", kind: "concept", term: "Learning rate", definition: "How big each learning step is. Too high and it overshoots" },
    { id: "c-epochs", domain: "d1", kind: "concept", term: "Epochs", definition: "Full passes over the training data" },
    { id: "c-aucroc", domain: "d1", kind: "concept", term: "AUC-ROC", definition: "How well a classifier separates classes across all cutoffs. 0.5 is a coin flip, 1 is perfect" },
    { id: "c-edge", domain: "d1", kind: "concept", term: "Edge inference", definition: "A small model on the device itself: very fast and works offline" },
    { id: "s-pipelines", domain: "d1", kind: "service", term: "SageMaker Pipelines", definition: "Automated workflows that build, train and deploy models, like CI/CD for ML" },
    { id: "s-featurestore", domain: "d1", kind: "service", term: "SageMaker Feature Store", definition: "One shared place to store and reuse ML features" },
    { id: "s-mturk", domain: "d1", kind: "service", term: "Amazon Mechanical Turk", definition: "A crowd of human workers for simple tasks like labeling" },
    { id: "c-customvocab", domain: "d1", kind: "concept", term: "Transcribe custom vocabulary", definition: "Teaches Transcribe your brand names, acronyms and jargon" },
  ],

  challenges: [
    {
      id: "ch-catch-all-fraud",
      domain: "d1",
      lesson: "d1-metrics",
      title: "Catch every fraud",
      goal: "Move the cutoff until recall hits 100%, so every red dot is flagged.",
      hint: "Recall goes up as you lower the cutoff. Keep an eye on what happens to precision.",
      takeaway: "Catching every positive means more false alarms. That's the price you pay when missing a case is costly.",
      render: (onSolved) => <ThresholdLab goal="catchAll" onSolved={onSolved} />,
    },
    {
      id: "ch-no-false-alarms",
      domain: "d1",
      lesson: "d1-metrics",
      title: "Zero false alarms",
      goal: "Find a cutoff with 100% precision, so no blue dots are flagged, that still catches at least 2 frauds.",
      hint: "Push the cutoff up, past the highest-scoring good transaction.",
      takeaway: "High precision means every alert is real. The catch is lower recall: a lot of fraud slips through.",
      render: (onSolved) => <ThresholdLab goal="noFalseAlarms" onSolved={onSolved} />,
    },
  ],
});
