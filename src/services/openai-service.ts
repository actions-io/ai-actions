import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });

const openai = new OpenAIApi(configuration);

const getCompletion = async (prompt:string) => {
  try {
    const completions = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are friendly assistant working in automated workflows environment.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completions.data.choices[0].message.content;
  } catch (err) {
    console.log(err);
  }
}

module exports = {
  getCompletion,
}
