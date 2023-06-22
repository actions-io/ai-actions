const router = require('express').Router();
const { authenticationMiddleware } = require('../middlewares/authentication');
const mondayController = require('../controllers/monday-controller');

router.post('/monday/execute_action', authenticationMiddleware, mondayController.executeAction);
router.post('/monday/get_prompt_templates', authenticationMiddleware, mondayController.getPromptTemplates);
router.post('/monday/get_prompt_options', authenticationMiddleware, mondayController.getPromptOptions);
// TODO(Anatoly): Add routes for AI Assistant and Image generation.

module.exports = router;
