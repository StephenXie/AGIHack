from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import JSONParser, FormParser, MultiPartParser, FileUploadParser
from rest_framework.permissions import AllowAny
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.document_loaders import PyPDFLoader
import os 
import voyageai
@api_view(['GET'])
@permission_classes([AllowAny])
def home(request):
    return Response({"data": "Hello World"})