import Outcall "./http-outcalls/outcall";
import Text "mo:core/Text";

actor {
  stable var geminiApiKey : Text = "";

  // Required transform function for http outcalls
  public query func transform(input : Outcall.TransformationInput) : async Outcall.TransformationOutput {
    Outcall.transform(input);
  };

  // Admin: configure optional Gemini API key for higher quality
  public func setGeminiApiKey(key : Text) : async () {
    geminiApiKey := key;
  };

  // Generate viral hashtags for a topic and platform
  // Returns JSON: {"high":[...],"medium":[...],"niche":[...]}
  public func generateHashtags(topic : Text, platform : Text) : async Text {
    let prompt = "Generate viral hashtags for " # topic # " on " # platform # ". Return ONLY a JSON object with three keys: high (array of 5 high-reach hashtags), medium (array of 5 medium-reach hashtags), niche (array of 5 niche hashtags). Every hashtag starts with #. Output JSON only.";
    if (geminiApiKey != "") {
      await callGemini(prompt);
    } else {
      await callPollinations(prompt);
    };
  };

  // Generate viral content topic ideas
  // Returns JSON array: [{"title":"...","desc":"..."},...]
  public func generateTopics(category : Text, platform : Text) : async Text {
    let prompt = "Generate 5 viral content topic ideas for " # category # " on " # platform # ". Return ONLY a JSON array where each element has: title (string) and desc (1-2 sentence description string). Output JSON only.";
    if (geminiApiKey != "") {
      await callGemini(prompt);
    } else {
      await callPollinations(prompt);
    };
  };

  // Get trending hashtags for a platform
  // Returns JSON array: [{"tag":"#...","score":95,"platform":"all"},...]
  public func getTrending(platform : Text) : async Text {
    let prompt = "List 10 trending hashtags for " # platform # " in 2025. Return ONLY a JSON array where each element has: tag (hashtag string starting with #), score (integer 60-99), platform (one of: all yt ig tt fb tw). Output JSON only.";
    if (geminiApiKey != "") {
      await callGemini(prompt);
    } else {
      await callPollinations(prompt);
    };
  };

  // Get sidebar content: popular hashtags and emerging topics
  // Returns JSON: {"hashtags":[...],"topics":[...]}
  public func getSidebarContent() : async Text {
    let prompt = "List popular social media hashtags and emerging content topics for 2025. Return ONLY a JSON object with: hashtags (array of 10 hashtag strings starting with #) and topics (array of 5 short topic name strings). Output JSON only.";
    if (geminiApiKey != "") {
      await callGemini(prompt);
    } else {
      await callPollinations(prompt);
    };
  };

  // Internal: call Pollinations.ai (free, no key required)
  func callPollinations(prompt : Text) : async Text {
    let escapedPrompt = escapeJsonString(prompt);
    let body = "{\"messages\":[{\"role\":\"user\",\"content\":\"" # escapedPrompt # "\"}],\"model\":\"openai\",\"seed\":42,\"jsonMode\":true}";
    await Outcall.httpPostRequest(
      "https://text.pollinations.ai/",
      [{ name = "Content-Type"; value = "application/json" }],
      body,
      transform,
    );
  };

  // Internal: call Google Gemini 1.5 Flash (free tier, requires API key)
  // Returns raw Gemini JSON response - frontend extracts text content
  func callGemini(prompt : Text) : async Text {
    let escapedPrompt = escapeJsonString(prompt);
    let body = "{\"contents\":[{\"parts\":[{\"text\":\"" # escapedPrompt # "\"}]}],\"generationConfig\":{\"responseMimeType\":\"application/json\"}}";
    await Outcall.httpPostRequest(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" # geminiApiKey,
      [{ name = "Content-Type"; value = "application/json" }],
      body,
      transform,
    );
  };

  // Escape special characters for safe JSON string embedding
  func escapeJsonString(s : Text) : Text {
    var result = "";
    for (c in s.chars()) {
      if (c == '\"') { result := result # "\\\"" }
      else if (c == '\\') { result := result # "\\\\" }
      else if (c == '\n') { result := result # "\\n" }
      else if (c == '\r') { result := result # "\\r" }
      else if (c == '\t') { result := result # "\\t" }
      else { result := result # Text.fromChar(c) };
    };
    result;
  };
};
