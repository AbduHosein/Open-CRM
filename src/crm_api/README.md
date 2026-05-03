## CRM API - Python Virtual Environment + Django Server Setup

Follow these steps to set up a reusable Python virtual environment for your projects.

---

### Pre-requisite ###

Make a .env file in nested level /crm_api/crm_api directory

```
DJANGO_SECRET=<generate a secret yourself and keep it private!>
GOOGLE_CLIENT_ID=<get this from google cloud app>
```


### 1. Install Python

Make sure Python is installed:

```bash
python3 --version
```

---

### 2. Install `virtualenv`

```bash
python3 -m pip install virtualenv
```

---

### 3. Create a Central Virtualenvs Folder

```bash
mkdir ~/virtualenvs
cd ~/virtualenvs
```

---

### 4. Create a New Virtual Environment

```bash
python3 -m virtualenv crm_api
```

---

### 5. Activate the Virtual Environment

#### Windows (PowerShell)

```powershell
.\crm_api\Scripts\Activate.ps1
```

#### macOS / Linux (Unix)

```bash
source crm_api/bin/activate
```

---

### ✅ You're Ready!

You can now install dependencies:

```bash
pip install -r requirements.txt
```

And start setup your sqlite db with two core Django commands:

```bash
python manage.py makemigrations // This makes migration files based on your django model schema. files.

python manage.py migrate // This applies said migrations to your configured db sqlite by default.
```

Now you can finally start the Django development server:

```bash
python manage.py runserver // Launches on localhost:8000 by default.
```

For more information, navigate to the API spec endpoint at http://localhost:8000/api-spec (defined in crm_api/urls.py)

To deactivate your virtual environment:

```bash
deactivate
```
