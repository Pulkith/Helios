import replicate
import os
from sglang import function, system, user, assistant, gen, set_default_backend, OpenAI
from hello import functionToTest

def run():
    def convert_py_file_to_raw_string(file_path):
        with open(file_path, 'r') as file:
            python_code = file.read()

        # Escape double quotes and add "<s>" character
        escaped_code = python_code.replace('"', r'\"')
        formatted_code = f"<s>```{escaped_code.strip()}```"

        return formatted_code


    # Example usage

    os.environ['REPLICATE_API_TOKEN'] = 'r8_NwOiblx7ASfvm2CPlElD0yUf9llNlEB2IbmRn'

    python_file_path = "file.py"
    raw_string_output = convert_py_file_to_raw_string(python_file_path)
    #print(repr(raw_string_output))


    output = replicate.run(
        "automorphic-ai/logos:32665c8d4c4394a451aa6909789ab5a66b8851c4f60d735ec89f6e9ac7e9a15b",
        input={
            "text": raw_string_output,
            "max_predicted_tokens": 5
        }
    )
    #print(output)

    data = output

    # Flatten the list of predicted_tokens
    all_tokens = [token for item in data for token in item['predicted_tokens']]

    # Sort the tokens by their probabilities in ascending order
    sorted_tokens = sorted(all_tokens, key=lambda x: x['prob'])

    # Get the 5 tokens with the lowest probabilities
    lowest_prob_tokens = sorted_tokens[:5]

    # Create a list to store the tuples
    pairs = []

    # Find the corresponding highest probability token for each lowest probability token
    for token in lowest_prob_tokens:
        for item in data:
            if token in item['predicted_tokens']:
                highest_prob_token = max(item['predicted_tokens'], key=lambda x: x['prob'])['token']
                pair = (token['token'], highest_prob_token)
                pairs.append(pair)
                break

    # Print the list of tuples
    #print(pairs)



    def exploit(questions=[('', ''), ('', '')]):
        def convert_py_to_txt(input_file, output_file):
            try:
                with open(input_file, 'r') as f_in:
                    py_code = f_in.read()
                    with open(output_file, 'w') as f_out:
                        f_out.write(py_code)
                print(f"Conversion successful: {input_file} converted to {output_file}")
            except FileNotFoundError:
                print("Error: File not found.")

        def convert_txt_to_string(file_path):
            try:
                with open(file_path, "r") as file:
                    file_contents = file.read()
                    return file_contents

            except FileNotFoundError:
                print(f"File '{file_path}' not found.")
            except Exception as e:
                print(f"An error occurred: {e}")

        @function
        def multi_turn_question(s, questions, fileName, inputs, outputs):
            convert_py_to_txt(fileName, fileName.replace(".py", ".txt"))
            fileString = convert_txt_to_string(fileName.replace(".py", ".txt")) + "\n\n"

            s += system(
                fileString + "\n Above is a function that we are going to generate input that breaks the function by finding edge cases. Only output a string and no other text as your output will be parsed by an algorithm")

            for i in range(0, len(questions)):
                s += user(
                    "Generate input to break the function and get an error given that we found that the function would be made better by replacing " + str(
                        questions[i][0]) + " with " + str(
                        questions[i][1]) + " and the last input given to function was " + str(
                        inputs[i]) + " and the correponding output was " + str(outputs[i]))
                s += assistant(gen("answer_" + str(i), max_tokens=256))

        set_default_backend(OpenAI("gpt-3.5-turbo"))

        state = multi_turn_question.run(
            questions, "file.py", [''] * len(questions)
    , [''] * len(questions)
        )

        for ij in range(0, 3):
            inputs = []
            outputs = []
            b = False
            print("\n NEW RUN \n")
            for m in state.messages():
                if m["role"].count("assistant") > 0:
                    inputs.append(m["content"])
                    try:
                        x = functionToTest(m["content"])
                        outputs.append(str(x))
                        print()
                        print(m["content"])
                        print(functionToTest(m["content"]))
                        print()
                    except:
                        print("SUCCESS")
                        print(m["content"])
                        return m["content"], data
                        b = True
                        break
            if b: break
            state = multi_turn_question.run([('', ''), ('', '')], "file.py", inputs, outputs, temperature=0.8)

    exploit(questions=pairs)