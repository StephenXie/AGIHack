from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser, FileUploadParser
from rest_framework.permissions import AllowAny
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
import os 
import voyageai
from .api import generate_edits, parse_gpt_output
@api_view(['GET'])
@permission_classes([AllowAny])
def home(request):
    return Response({"data": "Hello World"})

@api_view(['POST'])
@permission_classes([AllowAny])
def get_edits(request):
    text = request.data.get("text")
    tone = request.data.get("tone")
    x = generate_edits(text, tone)
    response = parse_gpt_output(x.content)
    return Response({"text": response})