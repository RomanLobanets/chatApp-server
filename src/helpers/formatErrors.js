import _ from "lodash";

const formatErrors = (error, models) => {
  if (error instanceof models.Sequelize.ValidationError) {
    return error.errors.map((x) => _.pick(x, ["path", "message"]));
  }
  return [{ path: "name", message: "something went wrong" }];
};

export default formatErrors;
