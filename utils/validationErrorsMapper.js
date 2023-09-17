function mapErrorValidationResultToObject(validationErrorResult) {
  return validationErrorResult
    .array({ onlyFirstError: true })
    .reduce((erroresAcumulados, errorActual) => {
      erroresAcumulados[errorActual.path] = errorActual.msg;
      return erroresAcumulados;
    }, {});
}

module.exports = mapErrorValidationResultToObject;
