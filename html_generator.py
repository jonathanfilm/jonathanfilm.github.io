# python script to generate website html from csv data and html templates


# import modules
import csv
from collections import namedtuple


# variables
csv_file = "/Users/gabrieleve/Downloads/JE website - Website content.csv"
portfolio_template_file = "portfolio-item.html"
html_output_file = "test.html"
portfolio_items = []


# read csv data into python
with open(csv_file, newline='') as f:
    content = csv.reader(f, delimiter=',')

    # iterate over each line of csv file
    for row in content:

        first_col_item = row[0]

        # skip if blank line
        if len(first_col_item) == 0:
            continue

        # if section header
        if first_col_item[0] == '#':
            section = first_col_item[1:]
            continue

        # if column headers
        if first_col_item[0] == '%':

            col_headers = tuple(header[1:] for header in row)

            if section == 'Portfolio':
                PortfolioItem = namedtuple('PortfolioItem', col_headers)

            continue


        if section == 'Portfolio':

            # TODO: deal with newlines

            col_URL = col_headers.index('URL')
            URL = row[col_URL]

            # format URLs for html embed based on type
            if URL == '':
                row[col_URL] = '#'

            elif URL[:17] == 'https://vimeo.com':
                row[col_URL] = ("https://player.vimeo.com/video"
                + URL[17:]
                + "?color=ffffff&title=0&byline=0&portrait=0")

            elif URL[:16] == 'https://youtu.be':
                row[col_URL] = "https://www.youtube-nocookie.com/embed" + URL[16:]

            else:
                print("Unrecognised portfolio URL")


            item = PortfolioItem(*row)
            portfolio_items.append(item)


        elif section == 'About':
            pass

        elif section == 'Contact':
            pass



with open(portfolio_template_file) as f:
    portfolio_template = f.read()


with open(html_output_file, 'w', newline='') as output:

    for item in portfolio_items:

        output.write(portfolio_template.format(portfolio_item=item))

print(html_output_file + " has been successfully created!")
