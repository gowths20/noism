export async function generateHook(title: string, summary?: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 80,
      messages: [{
        role: 'user',
        content: `Write ONE sentence (max 15 words) explaining why this is interesting to someone who has never heard of it. Be curious and specific, not generic.\n\nTitle: ${title}\n${summary ? `Context: ${summary}` : ''}\n\nReply with only the sentence, no quotes.`,
      }],
    }),
  });
  const data = await res.json();
  return (data.content?.[0]?.text as string)?.trim() ?? '';
}
