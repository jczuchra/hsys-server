export const createElement = async ({
  model,
  where,
  defaults,
  messages,
  callback,
}) => {
  try {
    const queryResult = await model.findOrCreate({
      where,
      defaults,
    });

    const { dataValues, _options: options } = queryResult && queryResult[0];
    if (options.isNewRecord) {
      if (callback) callback();
      return {
        message: messages.success,
        success: true,
        asset: dataValues,
      };
    }
    return {
      message: messages.exists,
      success: false,
    };
  } catch (error) {
    return {
      message: messages.error,
      succes: false,
      error,
    };
  }
};

export const getAllElements = async ({ model, where, messages }) => {
  try {
    const queryResult = await model.findAll({ where });
    const allElements = queryResult.map((element) => element.dataValues);
    const count = await model.count();
    return {
      count,
      allElements,
      info: {
        message: messages.success,
        success: true,
      },
    };
  } catch (error) {
    return {
      allElements: [],
      info: {
        message: messages.error,
        succes: false,
        error,
      },
    };
  }
};

export const deleteElement = async ({ model, where, cascade, messages }) => {
  try {
    const queryResult = await model.destroy({
      where,
      cascade,
    });
    if (queryResult) {
      return {
        message: messages.success,
        succes: true,
      };
    }
    return {
      message: messages.exists,
      succes: false,
    };
  } catch (error) {
    return {
      message: messages.error,
      succes: false,
      error,
    };
  }
};

export const editElement = async ({ model, where, messages, newValues }) => {
  try {
    const queryResult = await model.findOne({
      where,
    });
    const { dataValues, _options: options } = queryResult;
    queryResult.update({ ...dataValues, ...newValues });
    queryResult.save();
    return {
      message: messages.success,
      success: true,
      asset: dataValues,
    };
  } catch (error) {
    return {
      message: messages.error,
      succes: false,
      error,
    };
  }
};

export const getElement = async ({ model, where }) => {
  try {
    const element = await model.findOne({ where });
    return element;
  } catch (error) {
    return {};
  }
};
