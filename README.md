# 🔄 You-Loop

A lightweight, modern web application designed to repeat YouTube videos for a specified number of times. Perfect for studying, background music, or repeating favorite clips.

## ✨ Features

- **Custom Looping**: Specify exactly how many times you want a video to repeat.
- **Dark Mode Interface**: A sleek, high-contrast dark theme that is easy on the eyes.
- **Video History**: Automatically tracks your recently looped videos so you can quickly jump back into them.
- **Intelligent Error Handling**: Provides clear feedback if a URL is invalid, a video is unavailable, or if there are API-related issues (like missing Referrer headers).
- **Responsive Design**: Works beautifully on various screen sizes.

## 🚀 Getting Started

> **Important:** Due to security requirements of the YouTube IFrame API (specifically the `Referer` header requirement for certain operations), this application **must be served via a web server**. Opening the `index.html` file directly in your browser via `file://` will result in errors.

### Prerequisites
You will need [Python](https://www.python.org/) installed on your system (most macOS and Linux systems have it by default).

### Installation & Running

1. **Clone or Download** this repository to your local machine.
2. **Open your Terminal** (or Command Prompt/PowerShell).
3. **Navigate to the project directory**:
   ```bash
   cd path/to/you-loop
   ```
4. **Start a local web server**:
   ```bash
   # For Python 3 (recommended)
   python3 -m http.server 8000
   ```
5. **Open your browser** and navigate to:
   [http://localhost:8000](http://localhost:8000)

## 🛠️ How to Use

1. **Enter URL**: Paste a valid YouTube video URL into the input field.
2. **Set Loops**: Enter the number of times you want the video to repeat.
3. **Start Looping**: Click the **"Start Looping"** button.
4. **Manage History**: 
   - Click on a video in the **"Recent Loops"** section to replay it instantly.
   - Click **"Clear History"** to wipe your local history.

## ⚠️ Troubleshooting

| Error | Cause | Solution |
| :--- | :--- | :--- |
| **Error 153** | Missing HTTP Referer header. | You are likely opening the file directly (`file://`). **Use a local web server** as described in the "Getting Started" section. |
| **Error 100** | Video not found. | The video may have been deleted or made private. |
| **Error 101/150** | Embedding disabled. | The video owner has restricted playback on external websites. |

## 📜 License

This project is open-source and free to use.
```
