PY3_VENV=py3_simple_ml

all: run

run:
	python3 src/simple_ml.py

venv:
	python3 -m venv ${PY3_VENV}

install:
	pip3 install -r requirements.txt

format:
	pip3 install isort black flake8
	isort *.py src/**/*.py
	black *.py src/**/*.py

clean:
	rm -rf ${PY3_VENV}/
	rm -rf *.egg-info/
