

![Knowrex AI](https://img.shields.io/badge/Powered%20by-Google%20Gemini-blue)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan)

A professional AI-powered customer support chatbot built with Next.js 14 and Google's Gemini AI. Features real-time streaming responses, beautiful UI, dark mode, and chat persistence.

## ✨ Features

- 🤖 **AI-Powered Responses** - Uses Google Gemini 2.0 Flash for intelligent conversations
- ⚡ **Streaming Responses** - Watch responses appear word-by-word in real-time
- 🌙 **Dark Mode** - Toggle between light and dark themes
- 💾 **Chat Persistence** - Messages saved to localStorage, survives page refresh
- 📱 **Fully Responsive** - Works beautifully on desktop and mobile
- 🎨 **Modern UI** - Professional design with smooth animations
- ⌨️ **Keyboard Shortcuts** - Press Enter to send, Shift+Enter for new line
- 🔒 **Secure** - API key stays on server, never exposed to frontend

---

## 🚀 5-Step Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Get Your Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your new API key

### Step 3: Configure Environment Variables
```bash
# Create .env.local file in the project root
cp .env.example .env.local
```

Then edit `.env.local` and add your API key:
```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 4: Run the Development Server
```bash
npm run dev
```

### Step 5: Open in Browser
Navigate to [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
bizassist-ai/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Gemini API endpoint with streaming
│   ├── globals.css           # Global styles and animations
│   ├── layout.tsx            # Root layout with metadata
│   └── page.tsx              # Main chat interface
├── components/
│   ├── ChatMessage.tsx       # Individual message bubbles
│   ├── ChatInput.tsx         # Input field with send button
│   └── TypingIndicator.tsx   # "AI is typing..." animation
├── types/
│   └── chat.ts               # TypeScript type definitions
├── .env.example              # Environment variable template
├── .env.local                # Your actual environment variables (git-ignored)
└── README.md                 # This file
```

---

## 🧪 Testing Checklist

Test these scenarios to ensure everything works:

### Basic Functionality
- [ ] Page loads without errors
- [ ] Welcome message appears on first visit
- [ ] Sample questions are clickable
- [ ] Can type in the input field
- [ ] Can send messages with Enter key
- [ ] Can send messages with Send button
- [ ] AI responses stream in word-by-word

### UI/UX
- [ ] Dark mode toggle works
- [ ] Messages auto-scroll to bottom
- [ ] User messages appear on right (green avatar)
- [ ] AI messages appear on left (purple avatar)
- [ ] Typing indicator shows while waiting
- [ ] Timestamps display correctly

### Persistence
- [ ] Refresh page - messages still there
- [ ] Clear chat button works
- [ ] Dark mode preference persists

### Error Handling
- [ ] Empty messages can't be sent
- [ ] Network errors show friendly message
- [ ] Character counter works (2000 char limit)

---

## 🔍 3 Test Questions to Verify It's Working

Try these questions to test the AI integration:

1. **"What can you help me with?"**
   - Should get a helpful response about available assistance

2. **"Explain quantum computing in simple terms"**
   - Tests the AI's ability to explain complex topics
   - Watch for streaming response

3. **"Write me a short poem about customer service"**
   - Tests creative capabilities
   - Good for seeing streaming in action

---

## 🔧 How Gemini API Integration Works

The integration uses Google's official `@google/generative-ai` SDK:

1. **API Route Protection**: All Gemini API calls go through `/api/chat/route.ts`. The API key is stored in environment variables and never exposed to the browser.

2. **Streaming Response**: We use `sendMessageStream()` which returns chunks of text as they're generated. This creates the "typing" effect you see in ChatGPT.

3. **Chat History**: Each request includes the conversation history, allowing Gemini to maintain context across multiple messages.

4. **System Prompt**: A system prompt defines BizAssist AI's personality - professional, helpful, and focused on customer support.

---

## 🐛 Troubleshooting

### "AI service is not configured" Error
- **Cause**: Missing or invalid API key
- **Fix**: 
  1. Make sure `.env.local` exists in project root
  2. Verify `GEMINI_API_KEY` is set correctly
  3. Restart the dev server after changing env vars

### "Too many requests" Error
- **Cause**: Rate limiting from Gemini API
- **Fix**: Wait a moment and try again. Free tier has limits.

### Responses Not Streaming
- **Cause**: Network or configuration issue
- **Fix**: 
  1. Check browser console for errors
  2. Verify API route is working: visit `/api/chat` (should return status JSON)

### Messages Not Persisting
- **Cause**: localStorage issues
- **Fix**: 
  1. Check if localStorage is enabled in browser
  2. Clear browser data and try again

### Page Styling Looks Wrong
- **Cause**: Tailwind CSS not loading
- **Fix**: 
  1. Delete `.next` folder
  2. Run `npm run dev` again

### TypeScript Errors
- **Cause**: Missing types or module resolution
- **Fix**: 
  ```bash
  npm install
  # If issues persist:
  rm -rf node_modules .next
  npm install
  ```

---

## 🔐 Security Notes

- ✅ API key stored in environment variables
- ✅ All API calls proxied through Next.js API route
- ✅ API key never exposed to client-side code
- ✅ Input sanitization on server-side
- ⚠️ For production, add rate limiting and authentication

---

## 📈 What's Next? (Future Phases)

This is **Phase 1** of the BizAssist AI project:

- **Phase 2**: File upload and document processing
- **Phase 3**: RAG integration with vector database
- **Phase 4**: Multi-tenant support and custom branding
- **Phase 5**: Admin dashboard and analytics

---

## 📄 License

MIT License - Feel free to use this for your projects!

---

## 🙏 Credits

- Built with [Next.js 14](https://nextjs.org/)
- AI powered by [Google Gemini](https://ai.google.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy coding! 🚀**
