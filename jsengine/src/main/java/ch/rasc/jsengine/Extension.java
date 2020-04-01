package ch.rasc.jsengine;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import javax.script.Invocable;
import javax.script.ScriptEngine;
import javax.script.ScriptEngineManager;
import javax.script.ScriptException;

public class Extension {

  public static void main(String[] args)
      throws URISyntaxException, NoSuchMethodException, ScriptException, IOException {
    Path jsPath = Paths.get(Fibonacci.class.getResource("/factorialize.js").toURI());

    // Nashorn
    ScriptEngine nashornEngine = new ScriptEngineManager().getEngineByName("nashorn");
    try (BufferedReader reader = Files.newBufferedReader(jsPath)) {
      nashornEngine.eval(reader);

      Invocable invocable = (Invocable) nashornEngine;
      Object result = invocable.invokeFunction("factorialize", 5);

      System.out.println(result);
      System.out.println(result.getClass());
    }

    // GraalVM
    System.setProperty("polyglot.js.nashorn-compat", "true");

    ScriptEngine graalEngine = new ScriptEngineManager().getEngineByName("graal.js");
    try (BufferedReader reader = Files.newBufferedReader(jsPath)) {
      graalEngine.eval(reader);

      Invocable invocable = (Invocable) graalEngine;
      Object result = invocable.invokeFunction("factorialize", 5);

      System.out.println(result);
      System.out.println(result.getClass());
    }
  }

}
