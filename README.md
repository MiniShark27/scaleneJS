# ScaleneJS

This is aimed as a wrapper for scalene to provide visual feedback based on the results of the profiling. This tool automatically constructs an html file that provides a user feedback on the profiling.

## How to Set Up and Use

1. Download the files here and run `npm install`
2. Make sure that `scalene` is on your `PATH` enviroment variable (because this calls it from the command line)
3. Run the command `node index.js --file (path to python file)`
4. Go to http://localhost:3000 to view the results

## Tags:

1. Required: Run with `-f` or `--file` followed by the path to the file in order to specify to scalene which file to profile
2. Optional: Run with `-c` or `--console` to print the result to the console (Prints the standard scalene results)
3. Optional: Run with `-o` or `--original` to get the original html produced by running scalene with the `--html` tag

I made the optional tags originally for debugging and left them exposed because they could be useful

## Notes on files

- `template.html` stores a template for creating `new.html`
- `new.html` stores the new html UI for scalene
- `original.html` stores a copy of the old html from scalene
- `temp.txt` is a file that scalene writes to and serves as an intermediary between scalene and the `new.html` file

## Notes and Todo

### 1/9/2021

I made the basic setup for what I imagined the tool would be. I don't if this was what the expected tool was supposed to be (as it is locally hosted instead of run based off an exported dataset) but I thought it was a good starting point. I could change it to being usable from a remote website, but this was easier to set up. Things I need to do:

1. Improve the new page's UI (I have just set up the bare minimum + bar but could add some css to make it look better)
2. Make `-c` and `-o` mutually exclusive in the argument parser (because the code can only do one or the other but both are accepted by the argparser)
3. Make it so you don't need to do `-f` or `--file` before the file so it is `node index.js (path to python file)`
4. See if there is a way to get around having to add scalene to the path
5. Get feedback to see if anything need tweaking/fixing with code or design
