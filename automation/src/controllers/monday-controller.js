const mondayService = require('../services/monday-service');
const openAiService = require('../services/openai-service');
const transformationService = require('../services/transformation-service');
const { PROMPT_TEMPLATES } = require('../constants/prompt-templates');
const { PROMPT_OPTIONS } = require('../constants/prompt-options');

// Route: Action text transformation.
async function executeAction(req, res) {
  const { shortLivedToken } = req.session;
  const { payload } = req.body;

  try {
    const { inputFields } = payload;
    const {
      boardId,
      itemId,
      sourceColumnId,
      targetColumnId,
      transformationType, // TODO(Anatoly): Rename to Prompt.
      promptTemplateKey,
      promptOptionsKey,
    } = inputFields;

    console.log('[DEBUG] Action inputs:', inputFields);

    // Get current value from source column.
    const text = await mondayService.getColumnValue(shortLivedToken, itemId, sourceColumnId);
    if (!text) {
      return res.status(200).send({});
    }

    if (typeof text !== 'string' || !text) {
      return res.status(500).send({ message: 'Cannot read source value or it is empty' });
    }

    if (!promptTemplateKey || !promptTemplateKey.value) {
      return res.status(500).send({ message: 'Choose prompt: promptTemplateKey is empty' });
    }

    // Build prompt for LLM.
    let prompt = promptTemplateKey.value;
    if (promptOptionsKey && promptOptionsKey.value) {
      prompt = prompt + ' ' + promptOptionsKey.value;
    }
    prompt = prompt + `\n"""${text}"""`

    console.log('[DEBUG] Prompt:', prompt);

    // Request LLM to transform the text.
    const transformedText = await openAiService.getCompletion(prompt);

    console.log('[DEBUG] Completion:', transformedText);

    if (typeof transformedText !== 'string' || !transformedText) {
      return res.status(500).send({ message: 'Transformed text is empty' });
    }

    // Set new value for target column.
    await mondayService.changeColumnValue(shortLivedToken, boardId, itemId, targetColumnId, transformedText);

    return res.status(200).send({});
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

// TODO(Anatoly): Route for Image generation and upload.
// TODO(Anatoly): Route for AI Assistant text transformations.

// Route: Get available prompt templates.
// TODO(Anatoly): Make prompt templates customizable for users.
async function getPromptTemplates(req, res) {
  console.log('[DEBUG] getPromptTemplates: session:', req.session);
  console.log('[DEBUG] getPromptTemplates: body:', req.body);

  try {
    return res.status(200).send(PROMPT_TEMPLATES);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

// Route: Get available prompt options.
// TODO(Anatoly): Make prompt options customizable for users.
async function getPromptOptions(req, res) {
  try {
    return res.status(200).send(PROMPT_OPTIONS);
  } catch (err) {
    console.error(err);
    return res.status(500).send({ message: 'Internal Server Error' });
  }
}

module.exports = {
  executeAction,
  getPromptTemplates,
  getPromptOptions,
};
