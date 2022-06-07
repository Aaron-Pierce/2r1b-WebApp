import os
from os.path import exists
import sys
for file in os.listdir("./"):
    if file.endswith("red.jpg") or file.endswith("blue.jpg"):
        print(f"""{'{'}
    displayName: "{ " ".join([word.capitalize() for word in file.removesuffix("_blue.jpg").removesuffix("_red.jpg").split("-")])}",
    cardId: "{file.removesuffix(".jpg")}",
    pairsWith: ["{(file.removesuffix("_red.jpg") + "_blue") if file.endswith("_red.jpg") else  file.removesuffix("_blue.jpg") + "_red"}"]
{"},"}""")

        pair = ((file.removesuffix("_red.jpg") + "_blue") if file.endswith("_red.jpg") else  file.removesuffix("_blue.jpg") + "_red") + ".jpg"
        if not exists(pair):
            print("generated bogus pair " + pair, file=sys.stderr)
    elif file.endswith("_grey.jpg"):
        print(f"""{'{'}
    displayName: "{ " ".join([word.capitalize() for word in file.removesuffix("_grey.jpg").split("-")])}",
    cardId: "{file.removesuffix(".jpg")}",
    pairsWith: []
{"},"}""")
    else:
        print("Didn't know what to do with " + file, file=sys.stderr)
