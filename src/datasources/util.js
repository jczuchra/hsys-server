export const createElement = async ({ model, where, defaults, messages }) => {
    try {
        const queryResult = await model.findOrCreate({ 
            where,
            defaults,
           });
           const { dataValues, _options: options } = queryResult && queryResult[0];
           if (options.isNewRecord) {
             return {
                 message: messages.success,
                 success: true,
             }
           }
           return {
             message: messages.exists,
             success: false,
           };
    } catch(error) {
        return {
            message: messages.error,
            succes: false,
            error,
        }
    }
}

export const getAllElements = async ({ model, where, messages }) => {
    try {
        const queryResult = await model.findAll({ where });
        const allElements = queryResult.map((element) => element.dataValues);
        return {
            allElements,
            info: {
                message: messages.success,
                success: true,
            }
        }
    } catch(error) {
        return {
            allElements: [],
            info: {
                message: messages.error,
                succes: false,
                error,
            }
        }
    }
    
}

export const deleteElement = async ({ model, where, cascade, messages }) => {
    try {
        const queryResult = await model.destroy({
            where,
            cascade,
        })
        if (queryResult){
            return {
                message: messages.success,
                succes: true,
            }
        }
        return {
            message: messages.exists,
            succes: false,
        }
    } catch(error) {
        return {
            message: messages.error,
            succes: false,
            error,
        }
    }
}
