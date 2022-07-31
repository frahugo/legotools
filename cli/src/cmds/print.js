exports.command = "print <type>";
exports.desc = "Print items or part labels";
exports.builder = function (yargs) {
  return yargs.commandDir("print_cmds");
};
exports.handler = function (argv) {};
