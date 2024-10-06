# InterviewBit Chrome Extension

This extension is designed to help you prepare for technical interviews by providing a convenient and interactive way to practice interview questions directly from your browser. It replaces your new tab homepage to show random questions from available topics.

## Features

- **Random Question Notifications**: Receive periodic reminders to solve a new interview question.
- **Interactive Question Display**: View questions in a new tab with the option to blur answers for self-testing.
- **Customizable Topics**: Choose from a variety of topics to tailor your practice sessions.
- **Progress Tracking**: Keep track of your selected topics and practice history.
- **User-Friendly Interface**: Simple and intuitive design for easy navigation and use.

## Installation

1. Clone this repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable Developer Mode by toggling the switch in the top right corner.
4. Click on `Load unpacked` and select the cloned repository folder.
5. The extension should now be installed and ready to use!

## Usage

- Start Practicing: Once installed, Open a new tab with a random interview question.
- Toggle Answer Visibility: Click the answer to reveal or hide the answer, allowing you to test your knowledge.
- Customize Topics: Access the settings to select or deselect topics based on your preparation needs.

## Customization

- Modify Notification Frequency: Adjust the reminder interval by editing the `periodInMinutes` value in `background.js`.
- Add New Topics: Update the `topicsMap` in `script.js` to include additional topics or resources. Use [InterviewBit Technical Interview Questions](https://www.interviewbit.com/technical-interview-questions/) for reference.
