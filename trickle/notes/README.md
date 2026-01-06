# EduAssist AI Landing Page

This is a React-based landing page for a college support AI chatbot.

## Features
- **Interactive AI Agent**: A custom component (`AIAgent.js`) that tracks user cursor movement with its eyes and blinks randomly. Now supports emotions/gestures:
    - **Idle**: Follows cursor, blinks.
    - **Thinking**: Eyes spin, towers ping red.
    - **Happy/Answering**: Eyes squint joyfully, mouth smiles, towers glow green.
- **Chat Interface**: A simulated chat UI (`ChatInterface.js`) demonstrating the bot's capabilities and driving the Agent's emotions.
- **Login Page**: A dedicated login page (`login.html`) with a glassmorphism form.
- **3D Background**: A lightweight CSS-based 3D background (`Background3D.js`) using floating icons and parallax effects.
- **Responsive Design**: Fully responsive layout using Tailwind CSS.

## Structure
- `index.html`: Main landing page entry.
- `login.html`: Login page entry.
- `app.js`: Landing page root component.
- `login-app.js`: Login page root component.
- `components/`: Contains all UI modules.

## Customization
- To change the bot's responses, edit the `responses` array in `components/ChatInterface.js`.
- To adjust the eye tracking sensitivity, modify the `moveX` and `moveY` calculations in `components/AIAgent.js`.