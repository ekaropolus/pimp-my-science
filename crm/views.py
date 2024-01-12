from django.shortcuts import render
import pandas as pd
from django.http import JsonResponse
from django.http import HttpResponseServerError
import os
from rest_framework.decorators import api_view
import random


from googlesearch import search
import time

def linkedin_search(request):
    name = request.GET.get('name')

    if not name:
        return JsonResponse({"error": "Name parameter is missing."}, status=400)

    try:
        query = f'{name} site:linkedin.com/in/'
        results = list(search(query, tld="co.in", num=1, stop=1, pause=2))
        if results:
            linkedin_url = results[0]
        else:
            linkedin_url = "No LinkedIn profile found"
    except Exception as e:
        return JsonResponse({"error": f"Error during search for {name}: {str(e)}"}, status=500)

    return JsonResponse({"linkedin_url": linkedin_url})



def chat_view(request):
    return render(request, 'crm/chat.html')

from elsapy.elsclient import ElsClient
from elsapy.elssearch import ElsSearch

def get_scientists(request):
    try:
        # Define the path to your CSV file on PythonAnywhere
        csv_file_path = '/home/3karopolus/madlabs/crm/data/crm_mslabs.csv'

        # Check if the CSV file exists
        if not os.path.isfile(csv_file_path):
            return JsonResponse({"error": "CSV file not found."}, status=404)

        # Load data from the CSV file into a Pandas DataFrame
        scientists_df = pd.read_csv(csv_file_path)

        # Filter out records where LINKEDIN_URL is "no link" and INVESTIGADOR_LINKEDIN_MATCH is greater than 49
        scientists_df = scientists_df[(scientists_df['LINKEDIN_URL'] != "no link") & (scientists_df['INVESTIGADOR_LINKEDIN_MATCH'] > 49)]

        # Randomly select 1 record with NIVEL 3
        nivel_3_records = scientists_df[scientists_df['NIVEL'] == '3'].sample(n=1)

        # Randomly select 2 records with NIVEL 2
        nivel_2_records = scientists_df[scientists_df['NIVEL'] == '2'].sample(n=2)

        # Randomly select 3 records with NIVEL 1
        nivel_1_records = scientists_df[scientists_df['NIVEL'] == '1'].sample(n=3)

        # Randomly select 4 records with NIVEL C
        nivel_c_records = scientists_df[scientists_df['NIVEL'] == 'C'].sample(n=4)

        # Concatenate the selected records to create the final DataFrame
        final_selected_df = pd.concat([nivel_3_records, nivel_2_records, nivel_1_records, nivel_c_records])

        # Define your Elsevier API key
        api_key = '292fbca4bb6a813e1e40a327600a23a9'

        # Initialize the ElsClient
        client = ElsClient(api_key)

        # Scraping names from Google Scholar with a variable wait time (between 3 and 8 seconds)
        def scrape_names(query):
            try:
                # Create an ElsSearch object with the query
                search = ElsSearch(query, index="authors")
                search.execute(client, get_all=False)  # Perform the search

                if search.results:
                    # Get the author names from the search results
                    names = [author['preferred_name'] for author in search.results]
                else:
                    names = [{"error": "During scraping"}]
                return names
            except Exception as e:
                print(f"Error during scraping: {e}")
                return [{'error':'during scraping'}]

        final_selected_df['Scraped_Names'] = final_selected_df['NOMBRE_DEL_INVESTIGADOR'].apply(scrape_names)

        # Convert the DataFrame to a list of dictionaries (JSON format)
        scientists_list = final_selected_df.to_dict(orient='records')

        # Return the filtered and randomly selected data with scraped names as JSON response
        return JsonResponse(scientists_list, safe=False)
    except Exception as e:
        # Handle any exceptions that may occur
        return JsonResponse({"error": f"An error occurred: {str(e)}"}, status=500)




