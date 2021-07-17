import sys
import boto3
from trp import Document
import json

# Document
documentName = sys.argv[1]

# Amazon Textract client
textract = boto3.client('textract')

# Call Amazon Textract
with open(documentName, "rb") as document:
    response = textract.analyze_document(
        Document={
            'Bytes': document.read(),
        },
        FeatureTypes=["FORMS"])


doc = Document(response)


obj = {}
for page in doc.pages:
    for field in page.form.fields:
        obj[field.key.__str__()] = field.value.__str__()


print(json.dumps(obj))
