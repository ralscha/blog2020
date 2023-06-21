package ch.rasc.jsengine;

import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class Simple {

  public static void main(String[] args) throws ScriptException {
    // Nashorn
    ScriptEngine nashornEngine = new ScriptEngineManager().getEngineByName("nashorn");
    nashornEngine.eval("print('Hello World!');");

    // Graal
    ScriptEngine graalEngine = new ScriptEngineManager().getEngineByName("graal.js");
    graalEngine.eval("print('Hello World!');");
    
    ScriptEngine javascriptEngine = new ScriptEngineManager().getEngineByName("javascript");
    javascriptEngine.eval("print('Hello World!');");    
  }

}
