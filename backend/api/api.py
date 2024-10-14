from dotenv import load_dotenv
import os
import time
from uuid import uuid4
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.pydantic_v1 import BaseModel, Field

load_dotenv()

def generate_edits(text, tone):
    llm = ChatOpenAI(
        model="gpt-4o-mini",
        temperature=0.2,
        timeout=None,
        max_retries=2,
    )
    prompt = "You are an professional editor. You are reviewing a manuscript and you need to make several edits to improve the writing, but do not add anything to the text. Surround the original text with '$[' and ']$' and the new text with '#[' and ']#'.\n"
    examples = [{
            "Q": "Good morning! Me and him went to the store.",
            "A": "Good morning! $[Me and him]$#[He and I]# went to the store.",
        },
        {
            "Q": "I could care less. It's okay.",
            "A": "I $[could]$#[couldn't]# care less. It's okay.",
        },
        {
            "Q": "I'm going to lay down for a bit.",
            "A": "I'm going to $[lay]$#[lie]# down for a bit",
        },
    ]
    prompt += f" Here are some examples of edits you can make: {examples} \n"
    num_edits = len(text)//30
    prompt += tone_settings[tone]
    prompt += f"Make {num_edits-1} to {num_edits+3} edits to the following text: \n {text}" 
    # structured_llm = llm.with_structured_output(EditRecommendationModel)
    response = llm.invoke(prompt)
    return response

tone_settings = {
    "Professional": "Use a professional tone, keeping the language clear, respectful, and concise.",
    "Casual": "Keep the tone light, friendly, and conversational.",
    "Persuasive": "Motivate the reader to take action, using strong language and compelling arguments.",
    "Excited": "Use a highly energetic and enthusiastic tone.",
    "None": ""
}

class EditRecommendationModel(BaseModel):
    Edited_Text: str = Field(description="The edited text with the recommended changes.")
    Comments: list[str] = Field(description="Concise insight on each of the recommended changes.")



def get_open_tag(id):
    return f"<span style='color: rgb(127 29 29);	background-color: rgb(252 165 165); text-decoration-line: line-through;' id='{id}o'>"

def get_new_open_tag(id):
    return f"<span style='color: rgb(20 83 45); 	background-color: rgb(134 239 172);' id='{id}n'>"

def parse_gpt_output(raw_input):
    num_edits = 1
    original_open_tag = get_open_tag(num_edits)
    original_close_tag = "</span>"
    new_open_tag = get_new_open_tag(num_edits)
    new_close_tag = "</span>"
    output = ""
    i = 0
    while i < len(raw_input) - 2:
        if raw_input[i:i+2] == "$[":
            output += original_open_tag
            i += 2
        elif raw_input[i:i+2] == "]$":
            output += original_close_tag
            i += 2
        elif raw_input[i:i+2] == "#[":
            output += new_open_tag
            i += 2
        elif raw_input[i:i+2] == "]#":
            output += new_close_tag
            num_edits += 1
            i += 2
            original_open_tag = get_open_tag(num_edits)
            new_open_tag = get_new_open_tag(num_edits)
        else:
            output += raw_input[i]
            i += 1

    return output





def format_llm_output(output):
    res = {}
    for pair in output:
        res[pair[0]] = pair[1]
    return res

# x = generate_edits("I confidently marched out of the store with the hoodie. Just like any color on the light spectrum, yellow shines through as both a wave and a particle. To me, this color holds both the love and pain in me, naturally, simultaneously, authentically. It reminds me of that detached, frightened, and distressed nine year old kid, afraid to face uncertainty, yet desperate for a sliver of sunshine. Nonetheless, it also reminds me of the caring, optimistic, and hopeful person I’ve become. The yellow I wear, now faded and wrinkled, has never looked brighter and has become a testament to my growth.", "Professional")
# y = parse_gpt_output(x.Edited_Text)
# print(y)