export async function fetchWikipediaContext(topic: string): Promise<string> {
  try {
    const encodedTopic = encodeURIComponent(topic.trim());
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodedTopic}`;

    const response = await fetch(url, {
      headers: { "User-Agent": "AILearningAssistant/1.0" },
      signal: AbortSignal.timeout(2000),
    });

    if (!response.ok) {
      return "";
    }

    const data = await response.json();
    const extract: string = data.extract || "";

    const sentences = extract
      .split(". ")
      .slice(0, 3)
      .join(". ")
      .trim();

    return sentences ? `${sentences}.` : "";
  } catch {
    return "";
  }
}
