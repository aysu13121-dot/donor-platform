import sys

# Windows-un default konsol kodlaması (cp1252) Azərbaycan hərflərini (ə, ş, ı...)
# çap edərkən çökür. UTF-8-ə məcburi keçid bunun qarşısını alır.
for stream in (sys.stdout, sys.stderr):
    if hasattr(stream, 'reconfigure'):
        stream.reconfigure(encoding='utf-8')

from dotenv import load_dotenv

load_dotenv()

from app import create_app  # noqa: E402  (load_dotenv() env dəyərlərini Config oxumadan əvvəl set etməlidir)

app = create_app()

if __name__ == '__main__':
    print(f"Donor API Server başladı: http://127.0.0.1:{app.config['PORT']} (debug={app.config['DEBUG']})")
    # `threaded=True` - SvelteKit hər səhifə keçidində backend-ə bir neçə
    # sorğunu (auth yoxlaması + səhifə datası) demək olar ki paralel göndərir;
    # Werkzeug-un default tək-sorğulu dev server-i bunları növbəyə salıb
    # ara-sıra bağlantı kəsilməsi/timeout (görünüşcə "500 gəlib-gedir")
    # yaradırdı. Production-da bu, gunicorn-un öz worker modeli ilə həll olunur.
    app.run(host='0.0.0.0', port=app.config['PORT'], debug=app.config['DEBUG'], threaded=True)
