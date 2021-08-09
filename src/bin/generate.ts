import path from "path";
import fse from "fs-extra";

function generateStore(
  destination: string,
  {
    cwd,
    type,
  }: { cwd: string; type: "global" | "reducer" | "single" | string },
) {
  if (type === "single") {
    fse.copySync(
      path.join(__dirname, "../../templates/singleStore"),
      path.join(cwd, destination),
    );

    return;
  }

  if (type === "reducer") {
    fse.copySync(
      path.join(__dirname, "../../templates/singleReducer"),
      path.join(cwd, destination),
    );

    return;
  }

  fse.copySync(
    path.join(__dirname, "../../templates/sample"),
    path.join(cwd, destination, "store"),
  );
}

export default generateStore;
