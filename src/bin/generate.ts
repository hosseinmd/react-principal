import path from "path";
import fse from "fs-extra";

function generateStore(
  destination: string,
  { cwd, type }: { cwd: string; type: "global" | "local" | string },
) {
  if (type === "local") {
    fse.copySync(
      path.join(__dirname, "../../templates/singleFileStore"),
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
