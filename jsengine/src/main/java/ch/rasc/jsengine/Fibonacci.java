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

public class Fibonacci {
  public static void main(String[] args)
      throws ScriptException, IOException, URISyntaxException, NoSuchMethodException {

    Path jsPath = Paths.get(Fibonacci.class.getResource("/fibonacci.js").toURI());

    // Nashorn
    ScriptEngine nashornEngine = new ScriptEngineManager().getEngineByName("nashorn");
    try (BufferedReader reader = Files.newBufferedReader(jsPath)) {
      nashornEngine.eval(reader);

      Invocable invocable = (Invocable) nashornEngine;
      Object result = invocable.invokeFunction("fibonacci", 1_000);

      System.out.println(result);
    }

    // Graal
    ScriptEngine graalEngine = new ScriptEngineManager().getEngineByName("graal.js");
    try (BufferedReader reader = Files.newBufferedReader(jsPath)) {
      graalEngine.eval(reader);

      Invocable invocable = (Invocable) graalEngine;
      Object result = invocable.invokeFunction("fibonacci", 1_000);

      System.out.println(result);
    }

  }
}
