import openpyxl
from django.core.management.base import BaseCommand
from users.models import Univ

class Command(BaseCommand):
    help = '엑셀 파일을 읽어 DB에 저장합니다'

    def handle(self, *args, **options):
        wb = openpyxl.load_workbook('대학 이름 이메일.xlsx')
        ws = wb.active

        universities = []
        for row in ws.iter_rows(min_row=1, min_col=1, max_col=2, values_only=True):
            name, email_domain = row
            if not name or str(name).strip() == '':
                continue
            universities.append(Univ(univ_name=name, email_domain=email_domain))

        Univ.objects.bulk_create(universities)
        self.stdout.write(self.style.SUCCESS(f"{len(universities)}개 대학 저장 완료"))