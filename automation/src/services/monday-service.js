const initMondayClient = require('monday-sdk-js');

const getColumnValue = async (token, itemId, columnId) => {
  try {
    const mondayClient = initMondayClient();
    mondayClient.setToken(token);

    const query = `query($itemId: [Int], $columnId: [String]) {
      items (ids: $itemId) {
        column_values(ids:$columnId) {
          value
        }
      }
    }`;

    const variables = { columnId, itemId };

    const response = await mondayClient.api(query, { variables });
    console.log('[DEBUG] Query column value response:', JSON.stringify(response, null, 2));

    // TODO(Anatoly): Refactor & Introduce support for more column types.
    const rawValue = response.data.items[0].column_values[0].value;
    try {
      obj = JSON.parse(rawValue);
      console.log('[DEBUG] Column object:', obj);
      if (typeof obj === 'string')
        return obj

      return obj.text;
    } catch (err) {
      console.error(err);
      return rawValue;
    }
  } catch (err) {
    console.error(err);
  }
};

const changeColumnValue = async (token, boardId, itemId, columnId, value) => {
  try {
    const mondayClient = initMondayClient({ token });

    const query = `mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $value: String!) {
      change_simple_column_value (board_id: $boardId, item_id: $itemId, column_id: $columnId, value: $value) {
        id
      }
    }`;

    const variables = { boardId, columnId, itemId, value };

    const response = await mondayClient.api(query, { variables });
    return response;
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  getColumnValue,
  changeColumnValue,
};
