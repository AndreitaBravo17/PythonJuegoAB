from flask import Flask, render_template

# Inicializar la aplicacion
app = Flask(__name__, template_folder='templates')



#Ruta para llamara a la pagina principal.
@app.route('/')
def principal():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True) # Para ejecutar la aplicacion