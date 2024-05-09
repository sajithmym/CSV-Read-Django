from django.http import JsonResponse
from django.views import View
import os
import pandas as pd

class ReadExcel(View):
    data = None
    current_file = None

    def get(self, request, *args, **kwargs):
        if 'filepath' in request.GET:
            filepath = request.GET.get('filepath')
            start_position = int(request.GET.get('start_position', 0))

            print(f"Filepath: {filepath}  ::: Start Position: {start_position}")
            try:
                df = pd.read_csv(filepath)
                self.data = df.to_dict(orient='records')
                self.current_file = filepath
                if start_position == 0:
                    response_data = self.data[:400000]
                    return JsonResponse({'Data' : response_data, 'LastRecord': 400000})
                else:
                    end_position = start_position + 400000
                    response_data = self.data[start_position:end_position]
                    return JsonResponse({'Data' : response_data, 'LastRecord': end_position})
            except Exception as e:
                return JsonResponse({'Error' : str(e)})
        else:
            data_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'Ganison_dataset')
            filepaths = [os.path.join(data_dir, filename) for filename in os.listdir(data_dir) if filename.endswith('.csv')]
            return JsonResponse({'Filepaths' : filepaths})