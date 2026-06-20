import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { messages, tools } = await req.json();

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured. Add OPENROUTER_API_KEY to frontend/.env.local' },
        { status: 500 }
      );
    }

    const body: Record<string, unknown> = {
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are TaskForge AI, an intelligent assistant inside a project management board (TaskForge).
You help users manage tasks. When they ask to perform an action, use the available tools.
Always confirm what you did after executing a tool. Be concise and conversational.

Board structure: columns with title + cards. Each card has: title, details, priority (none/low/medium/high/urgent), tags, dueDate, assignee.`,
        },
        ...messages,
      ],
      max_tokens: 1024,
      temperature: 0.7,
    };

    if (tools && tools.length > 0) {
      body.tools = tools;
    }

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'TaskForge AI',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ error: `OpenRouter error ${res.status}: ${errText}` }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
