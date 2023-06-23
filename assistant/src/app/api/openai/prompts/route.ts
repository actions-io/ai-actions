import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken"
import { Configuration, OpenAIApi } from 'openai'

// Uncomment this if you get a StaticGenBailoutError from NextJS
export const dynamic = 'force-static'

// Set this to true if you're using localhost and having authentication issues
const DISABLE_AUTH = true;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


function isAuthorized(request: NextRequest) {
  try {
    const authorizationToken: string  = request?.headers.get('Authorization') ?? '';
    const clientSecret: string = process.env.CLIENT_SECRET ?? '';
    console.log('client-secret', clientSecret);
    console.log('authorizationToken', authorizationToken);
    const payload = jwt.verify(authorizationToken, clientSecret);

    if (payload) {
      return true;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function getCompletion(prompt: string): string {
  try {
    const completions = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completions.data.choices[0].message.content;
  } catch (err) {
    // @ts-ignore
    console.log(err);
  }

  return '';
}

export async function POST(req: NextRequest, res: NextResponse) {
  const reqJson = await req.json();

  console.log('request received:', JSON.stringify(reqJson, null, 2))

  if (!DISABLE_AUTH) {
    if (!isAuthorized(req)) {
        return NextResponse.json(
          { message: "Not authorized", success: false }, 
          { status: 401 }
        );
      } 
  } else {
    console.log('warning - skipping authentication step. To enable authentication, set DISABLE_AUTH to false.')
  }

  if (!reqJson.items) {
    return NextResponse.json({'message': 'No items array supplied'}, { status: 400 })
  }

  if (!reqJson.prompts) {
    return NextResponse.json({'message': 'No prompts given'}, { status: 400 })
  }

  const {items, prompts, n} = reqJson as {items: {id: string, column_values: [{text: string}]}[], prompts: string | string[], n: number};

  console.log('items: ', JSON.stringify(items, null, 2));

  if (items.length === 0) {
    return NextResponse.json([], {
      status: 200
    })
  }

  try {
    const data = await Promise.all(items.map(async item => {
      const result = await getCompletion(prompts + ' ' + '```' + item.column_values[0].text + '```')
      return {
        item: { id: item.id },
        result,
      }
    }))

    console.log('response data:', data)

    /*var results: number[] = await Promise.all(arr.map(async (item): Promise<number> => {
    await callAsynchronousOperation(item);
    return item + 1;
    }));*/


    /*const data = completions.map((completion, index) => {
      return {
        item: items[index],
        result: completion.text?.trim()
      }
    })*/

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    console.error(err)

    return NextResponse.json(err.response.data, { status: 200 })
  }
}
